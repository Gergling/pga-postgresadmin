import { LanguageModelProps } from "@/shared/features/llm";
import {
  LanguageModelErrorResponse,
  LanguageModelGeneratorFunction,
  LanguageModelSourceLevelConfigResponse,
  LanguageModelSourceLevelProps
} from "./types";

export const mapLanguageModelError = <
  LanguageModelSource extends string
>(props: Omit<
  LanguageModelErrorResponse<LanguageModelSource>,
  '_wsu'
>): LanguageModelErrorResponse<LanguageModelSource> => ({
  _wsu: 'WSU_RESPONSE',
  ...props,
});

export const generatorFactory = (
  sources: LanguageModelSourceLevelConfigResponse[]
) => (model: LanguageModelProps): LanguageModelGeneratorFunction => {
  const sourceLevelConfig = sources.find(
    ({ source }) => source === model.source
  );

  if (sourceLevelConfig === undefined) throw new Error(
    `No source level config found for ${model.source}.`
  );

  const generator: LanguageModelGeneratorFunction = async (props) => {
    // Probably a good place for a `task` call.
    const started = new Date().getTime();
    const response = await sourceLevelConfig.generate({
      ...props, model: model.name
    });
    const finished = new Date().getTime();
    const runtime = finished - started;
    return {
      runtime,
      source: model.source,
      ...response,
    };
  }

  return generator;
};

export const mapLanguageModels = <T>(
  models: T[], exclude: (model: T) => boolean,
  map: (model: T, index: number) => LanguageModelSourceLevelProps,
) => models.reduce((acc, model, i) => {
  if (exclude(model)) return acc;
  return [
    ...acc,
    map(model, i)
  ];
}, [] as LanguageModelSourceLevelProps[]);
