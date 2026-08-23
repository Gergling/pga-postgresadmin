import { ZodType } from 'zod';
import { LogApi } from '@/main/shared/logging';
import {
  LanguageModelGeneratorFunction,
  LanguageModelOrchestrationUpdateFunction,
  LanguageModelSourceLevelConfigResponse
} from "../types";
import { getRetryTimeout } from '../get-update-props';
import { fetchNextModelFactory } from '../selection';
import { generatorFactory } from '../utilities';
import { LanguageAnalysisState } from "./state";
import { LanguageModelProps, LlmCoreIdentifier } from '@/shared/features/llm';
import { llmSummariseOperation } from '../crud';

const runModel = <CompletionProps>({
  generator,
  logApi: { log },
  model,
  prompt,
  retry,
  schema,
}: {
  generator: LanguageModelGeneratorFunction;
  logApi: LogApi;
  model: LanguageModelProps;
  prompt: string;
  retry: LanguageAnalysisState<CompletionProps>;
  schema?: ZodType<CompletionProps>;
}) => log(
  `Run model: ${model.source} ${model.name}`,
  async (logApi) => {
    const result = await generator({
      logApi,
      prompt: [prompt, retry.promptAppendix].join('\n'),
      schema,
      temperature: retry.temperature,
    });
    if (result.status === 'failed') {
      logApi.setStatus('warning', result.message);
    } else {
      if (result.status !== 'success') {
        const message = result.status === 'unexpected'
          ? ` ${result.message}` : '';
        logApi.setStatus(
          'warning',
          `Failed due to ${result.status}.${message}`
        );
      }
    }
    return result;
  }
);

export const configureLanguageModelStrategies = (
  sources: LanguageModelSourceLevelConfigResponse[]
) => {
  const fetchNextModel = fetchNextModelFactory(sources);
  const generatorLookup = generatorFactory(sources);

  const analyser = async <CompletionProps>(
    prompt: string,
    operation: string,
    { log }: LogApi,
    update: LanguageModelOrchestrationUpdateFunction<CompletionProps>,
    options?: {
      retryOnStringResponse?: boolean;
      schema?: ZodType<CompletionProps>;
      // TODO: Optional transformer if not defaulting to string response and
      // schema.
    },
  ): Promise<void> => log(
    `Running language model analysis: ${operation}`,
    async (logApi): Promise<void> => {
      const { log } = logApi;
      const preferredModels: LlmCoreIdentifier[] = [];
      const retry = LanguageAnalysisState.from({
        operation,
        retryOnStringResponse: !!options?.retryOnStringResponse,
        schema: options?.schema,
      });
      while (retry.canAttempt) {
        await log(
          `Attempt ${retry.attempts + 1} of ${retry.maximumAttempts}`,
          async (logApi) => {
            const { setStatus, log } = logApi;
            const model = await log(
              'Fetch next model', (logApi) => fetchNextModel({
                attempts: retry.attempts,
                excluded: retry.excludedModels,
                logApi,
                operation,
                preferred: preferredModels,
              })
            );

            if (!model) throw new Error('No more models available.');

            const generator = generatorLookup(model);

            retry.setModel(model.source, model.name);

            const result = await runModel({
              generator, logApi, model, prompt, retry, schema: options?.schema,
            });

            const emissionResponse = retry.processResult(result);

            update(emissionResponse);

            if (emissionResponse.payload.status === 'success') return;

            if (retry.canAttempt) {
              const retryTimeout = getRetryTimeout(retry, result);
              setStatus('warning', `Retrying in ${retryTimeout}ms.`);
              await new Promise(resolve => setTimeout(resolve, retryTimeout));
            } else {
              throw new Error('Will not be retrying.');
            }
          }
        );
      }
      await llmSummariseOperation(operation, logApi);
    }
  );

  return analyser;
};
