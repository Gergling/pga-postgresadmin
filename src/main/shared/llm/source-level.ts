import {
  LanguageModelProps,
  LanguageModelSourceLevelConfigParams,
  LanguageModelSourceLevelConfigResponse,
  LanguageModelSourceLevelFunction,
} from "./types";

export const languageModelSourceLevelConfig: LanguageModelSourceLevelFunction = (
  props: LanguageModelSourceLevelConfigParams
): LanguageModelSourceLevelConfigResponse => {
  const models = async (
    ...args: Parameters<LanguageModelSourceLevelConfigResponse['models']>
  ): Promise<LanguageModelProps[]> => {
    const models = await props.models(...args);
    return models.map((model) => ({
      ...model,
      source: props.source,
    }));
  };

  return {
    ...props,
    models,
  };
};
