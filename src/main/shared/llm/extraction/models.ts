import { LlmSourceModelResponse } from "@/shared/features/llm";
import {
  LanguageModelOrchestrationListFunctionParams,
  LanguageModelSourceLevelConfigResponse
} from "../types";

export const fetchSourceModelsFactory = ({
  excluded, logApi: { log }, preferred
}: Pick<
  LanguageModelOrchestrationListFunctionParams,
  'excluded' | 'logApi' | 'preferred'
>) => ({
  models, source
}: LanguageModelSourceLevelConfigResponse) => log(
  source, async (logApi): Promise<LlmSourceModelResponse> => {
    try {
      const sourceModels = await models({ excluded, logApi, preferred });
      return {
        models: sourceModels,
        source,
      };
    } catch (error) {
      console.error(source, error);
      return {
        error,
        models: [],
        source,
      };
    }
  }
);

export const fetchSourceModels = async ({
  excluded, logApi: { log }, preferred, sources,
}: Pick<
  LanguageModelOrchestrationListFunctionParams,
  'excluded' | 'logApi' | 'preferred'
> & { sources: LanguageModelSourceLevelConfigResponse[] }) => log(
  'Getting models for sources',
  (logApi) => Promise.all(sources.map(fetchSourceModelsFactory({
    excluded, logApi, preferred
  })))
);

export const fetchModels = async (params: Pick<
  LanguageModelOrchestrationListFunctionParams,
  'excluded' | 'logApi' | 'preferred'
> & { sources: LanguageModelSourceLevelConfigResponse[] }) => {
  const sourced = await fetchSourceModels(params);

  // Flatten and filter out models which have been excluded.
  const models = sourced.reduce((acc, { models }) => {
    const unexcludedModels = models.filter(
      ({ priority }) => priority !== 'excluded'
    );
    return [...acc, ...unexcludedModels];
  }, []);

  return models;
};
