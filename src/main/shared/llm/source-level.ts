import { LanguageModelProps, LlmCoreIdentifier, LlmCorePriority } from "@/shared/features/llm";
import {
  LanguageModelSourceLevelConfigParams,
  LanguageModelSourceLevelConfigResponse,
  LanguageModelSourceLevelFunction,
} from "./types";

const getPriority = (
  name: string,
  excluded: string[],
  preferred: string[],
): LlmCorePriority | undefined => {
  if (excluded.includes(name)) return 'excluded';
  if (preferred.includes(name)) return 'preferred';
}

export const languageModelSourceLevelConfig: LanguageModelSourceLevelFunction = (
  props: LanguageModelSourceLevelConfigParams
): LanguageModelSourceLevelConfigResponse => {
  const reduceMatchingSourceModelName = (acc: string[], {
    name, source
  }: LlmCoreIdentifier) => {
    if (source === props.source) return [...acc, name];
    return acc;
  }
  const models: LanguageModelSourceLevelConfigResponse['models'] = async (
    params
  ): Promise<LanguageModelProps[]> => {
    const excluded = params.excluded.reduce(reduceMatchingSourceModelName, []);
    const preferred = params.excluded.reduce(reduceMatchingSourceModelName, []);
    const models = await props.models(params);
    return models.map((model) => ({
      ...model,
      priority: getPriority(model.name, excluded, preferred),
      source: props.source,
    }));
  };

  return {
    ...props,
    models,
  };
};
