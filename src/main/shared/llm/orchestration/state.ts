import z from "zod";
import {
  LanguageModelResponseStatus,
  LanguageModelResponseStatusRetryable,
} from "@/main/shared/llm";
import { hashFactory } from "@shared/utilities";

const analyseLanguageStateSchema = z.object({
  log: z.array(z.object({
    model: z.string(),
    status: z.string(),
  })).default([]).describe('A log of what has been tried so far'),
  maximumFailures: z.number().default(4),
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

const logFailureActionFactory = (
  model: string, status: LanguageModelResponseStatus
): AnalyseLanguageStateAction => (state) => {
  return {
    ...state,
    log: [
      ...state.log,
      { model, status },
    ],
  };
};

const promptAppendixErrorState: Record<LanguageModelResponseStatusRetryable, string> = {
  'parsing-incompatibility': 'a non-JSON-compatible string',
  'rate-limitations': 'a rate-limited response (e.g. 429)',
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
  }, {
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

export class LanguageAnalysisState {
  private state: AnalyseLanguageState;
  private hasher: () => number;

  constructor(initial?: Partial<AnalyseLanguageState>, seed?: number) {
    this.state = analyseLanguageStateSchema.parse({ ...initial });
    this.hasher = hashFactory(seed ?? Math.random());
  }

  get attempts() {
    return this.state.log.length;
  }

  get maximumAttempts() {
    return this.state.maximumFailures;
  }

  get canAttempt() {
    // We should try and run it at least once.
    if (this.attempts === 0) return true;

    // We should cap the attempts to avoid infinite loops.
    return this.attempts < this.state.maximumFailures;
  }

  get excludedModels() {
    return this.state.log.map(({ model }) => model);
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
    if (this.attempts === 0) return 0;
    const {
      some: { parsingIncompatibility },
    } = this.logReport;

    if (parsingIncompatibility) return 0.1;

    return 0;
  }

  logFailure(model: string, status: LanguageModelResponseStatus) {
    const action = logFailureActionFactory(model, status);
    this.state = action(this.state);
    return this;
  }
}
