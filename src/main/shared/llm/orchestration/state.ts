import z from "zod";
import { Mandatory } from "@/shared/types";
import { hashFactory } from "@/shared/utilities";
import {
  LanguageModelGeneratorResponse,
  LanguageModelResponseStatusRetryable,
  LlmCoreIdentifier
} from "@/shared/features/llm";
import { llmModelRunInsert } from "../crud";
import { transformLanguageModelResponse } from "./transform";
import { LanguageModelOrchestrationUpdateProps, llmRunCore, llmRunCoreStarted } from "../types";
import { getUpdateProps } from "../get-update-props";

const analyseLanguageStateSchema = z.object({
  current: z.discriminatedUnion('phase', [
    z.object({ phase: z.literal('ready') }),
    z.object({ phase: z.literal('started') }).extend(llmRunCoreStarted.shape),
    z.object({ phase: z.literal('finished') }).extend(llmRunCore.shape),
  ]).default({ phase: 'ready' }),
  log: z.array(llmRunCore).default([])
    .describe('A log of what has been tried so far'),
  maximumFailures: z.number().default(10),
  succeeded: z.boolean().default(false),
});

export type AnalyseLanguageState = z.infer<typeof analyseLanguageStateSchema>;

export type AnalyseLanguageStateGetter<
  T extends keyof AnalyseLanguageState
> = (
  props: AnalyseLanguageState
) => AnalyseLanguageState[T];
export type AnalyseLanguageStateAction = (
  props: AnalyseLanguageState
) => AnalyseLanguageState;

const setModelActionFactory = (
  source: string, model: string
): AnalyseLanguageStateAction => (state) => {
  return {
    ...state,
    current: { model, phase: 'started', source },
  };
};

// finish - move the current state into the log
const logResultActionFactory = (
  operation: string
): AnalyseLanguageStateAction => (state) => {
  if (state.current.phase !== 'finished') throw new Error(
    `Logging LLM result without finished run for operation: ${operation}`
  );
  const succeeded = state.current.status === 'success';
  return {
    ...state,
    current: { phase: 'ready' },
    log: [...state.log, state.current],
    succeeded
  };
};

const promptAppendixErrorState: Record<LanguageModelResponseStatusRetryable, string> = {
  'parsing-incompatibility': 'a non-JSON-compatible string',
  'rate-limitations': 'a rate-limited response (e.g. 429)',
  'string-retry': 'a string response when a string-retry setting was given',
  'traffic': 'an error caused by to high traffic (e.g. 503)',
};

const getLogReport = ({ log }: AnalyseLanguageState) => log.reduce(
  (report, { status }, i) => {
    const isLast = i === log.length - 1;

    const parsingIncompatibility = status === 'parsing-incompatibility';
    const serverRetry = status === 'rate-limitations' || status === 'traffic';

    const last = isLast ? {
      ...report.last,
      parsingIncompatibility,
    } : report.last;
    const some = {
      ...report.some,
      parsingIncompatibility: report.some.parsingIncompatibility || parsingIncompatibility,
      serverRetry: report.some.serverRetry || serverRetry,
    };
    const total = {
      ...report.total,
      serverRetry: report.total.serverRetry + (serverRetry ? 1 : 0),
    };

    return {
      ...report,
      last,
      some,
      total,
    };
  },
  {
    last: {
      parsingIncompatibility: false,
    },
    some: {
      parsingIncompatibility: false,
      serverRetry: false,
    },
    total: {
      serverRetry: 0,
    },
  }
);

// Update props can be set as we go along.
// Can trigger the update callback function when ready.
// When that happens, can also update the training log (operation, source,
// model, status, runtime, so we can filter for the operation and aggregate the
// sources and models sorted by descending probability of success and ascending
// mean runtime).

type Params<UpdateCompletionProps> = {
  initial: AnalyseLanguageState;
  operation: string;
  retryOnStringResponse: boolean;
  schema?: z.ZodType<UpdateCompletionProps>;
  seed?: number;
};

export class LanguageAnalysisState<UpdateCompletionProps> {
  private hasher: () => number;
  private operation: string;
  // TODO: Technically this type IS very much known.
  private promises: Promise<unknown>[] = [];
  private retryOnStringResponse: boolean;
  private state: AnalyseLanguageState;
  private schema?: z.ZodType<UpdateCompletionProps>;

  constructor({
    initial, operation, retryOnStringResponse, schema, seed
  }: Params<UpdateCompletionProps>) {
    this.hasher = hashFactory(seed ?? Math.random());
    this.operation = operation;
    this.retryOnStringResponse = retryOnStringResponse;
    this.schema = schema;
    this.state = initial;
  }

  static from<UpdateCompletionProps>(
    params: Mandatory<Params<UpdateCompletionProps>, 'operation' | 'retryOnStringResponse'>
  ) {
    const initial = analyseLanguageStateSchema.parse({ ...params?.initial });
    return new LanguageAnalysisState<UpdateCompletionProps>({
      ...params,
      initial,
      seed: params?.seed ?? Math.random(),
    });
  }

  // If we've started, that counts as another attempt, but won't have been
  // logged yet.
  get attempts() {
    if (this.state.current.phase === 'ready') return this.state.log.length;
    return this.state.log.length + 1;
  }

  get maximumAttempts() {
    return this.state.maximumFailures;
  }

  get canAttempt() {
    if (this.state.succeeded) return false;

    // We should try and run it at least once.
    if (this.attempts === 0) return true;

    // We should cap the attempts to avoid infinite loops.
    return this.attempts < this.state.maximumFailures;
  }

  get excludedModels(): LlmCoreIdentifier[] {
    return this.state.log.map(({ model, source }) => ({ name: model, source }));
  }

  get logReport() {
    return getLogReport(this.state);
  }

  get retryTimeout() {
    const {
      last: { parsingIncompatibility: lastLogWasParsingIncompatibility },
      some: { serverRetry: addJitter },
      total: { serverRetry: backoffLevel },
    } = this.logReport;

    const jitter = addJitter ? this.hasher() * 1000 : 0;
    if (lastLogWasParsingIncompatibility) return 1000 + jitter;

    return (Math.pow(2, backoffLevel) * 1000) + jitter;
  }

  get promptAppendix(): string {
    if (this.attempts === 0) return '';
    return this.state.log.map(({ model, status }, i) => [
      `Attempt ${i + 1} with model "${model}" resulted in`,
      promptAppendixErrorState[status as LanguageModelResponseStatusRetryable],
    ].join(' ')).join('.\n');
  }

  get temperature(): number {
    if (this.attempts === 0) return 0.1;
    const {
      some: { parsingIncompatibility },
    } = this.logReport;

    if (parsingIncompatibility) return 0.1;

    return 0.1;
  }

  // Update run throughout the process.
  // Run a function when it starts... for whatever reason.
  // Set the model and source after they're chosen.
  setModel(source: string, model: string) {
    // Set the current model.
    const action = setModelActionFactory(source, model);
    this.state = action(this.state);
    return this;
  }

  /**
   * The most efficient way to handle the emission state AND logging is to
   * trigger both from one function. This will start a log run in the
   * background, and return the emission props.
   * @param result The language model response type for a string response.
   * @returns LanguageModelOrchestrationUpdateProps<UpdateCompletionProps>
   */
  processResult(
    result: LanguageModelGeneratorResponse
  ): LanguageModelOrchestrationUpdateProps<UpdateCompletionProps> {
    const operation = this.operation;

    if (this.state.current.phase !== 'started') throw new Error(
      `Setting LLM result without starting model for operation: ${operation}`
    );

    const currentState: AnalyseLanguageState['current'] = {
      ...this.state.current,
      phase: 'finished', runtime: result.runtime, status: result.status,
    };
    const llm = { ...currentState, name: currentState.model };

    // An unsuccessful response can yield a simple
    if (result.status !== 'success') {
      this.handleRunCompletion(currentState);
      return getUpdateProps(this, result, llm);
    }

    // The initial response appears successful, so we transform.
    const response = transformLanguageModelResponse({
      source: this.state.current.source,
      response: result.response, schema: this.schema,
    });

    // The response can come back undefined from some models, so we have to handle
    // it by overriding the status.
    if (response === undefined) {
      const status = 'parsing-incompatibility';
      this.handleRunCompletion({ ...currentState, status });
      return getUpdateProps(this, {
        ...result,
        canRetry: true,
        status,
      }, llm);
    }

    this.handleRunCompletion(currentState);

    // If it's not a string, it's the type we want.
    if (typeof response !== 'string') {
      return getUpdateProps(this, {
        ...result,
        response,
      }, llm);
    }

    // At this point, we know we're getting a string type response.
    const stringResponse: LanguageModelOrchestrationUpdateProps<UpdateCompletionProps> = {
      attempts: {
        current: this.attempts,
        maximum: this.maximumAttempts,
      },
      llm,
      payload: { ...result, response },
      retryTimeout: this.retryTimeout,
      type: 'string',
      willRetry: this.canAttempt,
    };

    // If we didn't want to retry on a string response, we can just return the
    // response.
    // TODO: Test earlier whether the schema we're using is just a string schema.
    // This is to catch misconfigurations of the call sooner.
    if (!this.retryOnStringResponse) return stringResponse;

    // Otherwise, we return a retry response.
    return {
      ...stringResponse,
      payload: { ...result, canRetry: true, status: 'string-retry' },
      willRetry: true,
    };

  }
  handleRunCompletion(current: AnalyseLanguageState['current']) {
    const operation = this.operation;

    if (current.phase !== 'finished') throw new Error(
      `Setting LLM result without starting model for operation: ${operation}`
    );

    this.state = logResultActionFactory(operation)({ ...this.state, current });

    // Persist the current run.
    const persistencePromise = llmModelRunInsert({ ...current, operation });

    this.promises.push(persistencePromise);
  }

  /**
   * This is JIC we want to await the persistence operations.
   */
  async awaitOperations() {
    await Promise.all(this.promises);

    // Once we're done, we can clear the promises.
    this.promises.length = 0;
  }
}
