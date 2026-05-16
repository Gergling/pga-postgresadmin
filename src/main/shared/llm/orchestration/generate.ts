import { Task } from 'tasuku';
import { ZodType } from 'zod';
import {
  LanguageModelOrchestrationUpdateFunction,
  LanguageModelResponseSchema,
  LanguageModelSourceLevelConfigResponse
} from "../types";
import { generatorFactory } from '../utilities';
import { fetchNextModelFactory } from './select';
import { LanguageAnalysisState } from "./state";
import { transformLanguageModelResponse } from './transform';
import { getRetryTimeout, getUpdateProps } from '../get-update-props';

export const configureLanguageModelStrategies = (
  sources: LanguageModelSourceLevelConfigResponse[]
) => {
  const fetchNextModel = fetchNextModelFactory(sources);
  const generatorLookup = generatorFactory(sources);

  const analyser = async <CompletionProps>(
    prompt: string,
    task: Task,
    update: LanguageModelOrchestrationUpdateFunction<CompletionProps>,
    options?: {
      schema?: ZodType<CompletionProps>,
      // TODO: Optional transformer if not defaulting to string response and
      // schema.
    },
  ): Promise<void> => {
    // Hardcoding for now. Later we can decide we want to put certain
    // sources/models at the top of the list.
    const preferredModels: string[] = [];
    const retry = new LanguageAnalysisState();

    // const { error, result, state, warning } = 
    await task(
      'Language model analysis ' + (new Date().toLocaleString()),
      async ({ task }): Promise<void> => {
        while (retry.canAttempt) {
          await task(
            `Attempt ${retry.attempts + 1} of ${retry.maximumAttempts}`,
            async ({ setWarning, setError, task }) => {
              const { result: model } = await task(
                'Fetch next model', ({ task }) => fetchNextModel(
                  preferredModels, retry.excludedModels, task
                )
              );
    
              if (!model) throw new Error('No more models available.');
    
              const generator = generatorLookup(model);

              const { result } = await task(
                `Run model: ${model.source} ${model.name}`,
                async ({ setError, setWarning }) => {
                  const result = await generator({
                    prompt: [prompt, retry.promptAppendix].join('\n'),
                    schema: options?.schema,
                    temperature: retry.temperature,
                  });
                  if (result.status === 'failed') setError(result.message);
                  if (result.status !== 'failed' && result.status !== 'success') {
                    setWarning(`Failed due to ${result.status}.`);
                  }
                  return result;
                },
                { showTime: true }
              );

              if (result.status !== 'success') {
                retry.logFailure(model.name, result.status);
              } else {
                const response = transformLanguageModelResponse({
                  source: model.source, response: result.response,
                  schema: options?.schema
                });

                if (response === undefined) {
                  const payload: LanguageModelResponseSchema<CompletionProps> = {
                    ...result,
                    canRetry: true,
                    status: 'parsing-incompatibility',
                  };

                  retry.logFailure(model.name, payload.status);

                  update(getUpdateProps(retry, payload));

                  return;
                }

                retry.logSuccess();

                update({
                  attempts: {
                    current: retry.attempts + 1,
                    maximum: retry.maximumAttempts,
                  },
                  payload: { ...result, response },
                  retryTimeout: retry.retryTimeout,
                  willRetry: retry.canAttempt,
                });
    
                return;
              }
    
              update(getUpdateProps<CompletionProps>(retry, result));

              if (retry.canAttempt) {
                const retryTimeout = getRetryTimeout(retry, result);
                setWarning(`Retrying in ${retryTimeout}ms.`);
                await new Promise(resolve => setTimeout(resolve, retryTimeout));
              } else {
                setError('Will not be retrying.');
              }
            }
          );
        }
      }, { showTime: true }
    );

    // TODO: Process error, result, state, warning
  };

  return analyser;
};
