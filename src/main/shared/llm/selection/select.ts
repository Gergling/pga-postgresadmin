import { Task } from 'tasuku';
import {
  LanguageModelOrchestrationListFunction,
  LanguageModelProps,
  LanguageModelSourceLevelConfigResponse,
} from "../types";
import { compareLanguageModels } from "./comparators";

export const fetchNextModelFactory = (
  sources: LanguageModelSourceLevelConfigResponse[]
): LanguageModelOrchestrationListFunction => {
  if (sources.length === 0) throw new Error('No sources provided.');
  return async (
    preferred: string[], excluded: string[], task: Task
  ): Promise<LanguageModelProps | undefined> => {
    // Get all possible models.
    const sourced = await task.group((task) => (
      sources.map(({ models, source }) => task(
        `Getting models for ${source}`, () => models(preferred, excluded)
      ))
    ), { concurrency: 5, maxVisible: height => height - 5 });

    // If we have run out of models, we simply return.
    if (sourced.length === 0) return;

    // Flatten, sort and select the top.
    const sorted = sourced.map(
      ({ result }) => result
    ).flat().sort(compareLanguageModels);
    return sorted[0];
  }
};

// type ParameterValue = 'preferred' | 'required';
// type ModelParameters = {
//   [K in keyof Partial<LanguageModelProps>]: {
//     type: ParameterValue;
//     value: LanguageModelProps[K];
//   };
// };
// const computeParameters = (): ModelParameters => {
//   // If no internet, local is a requirement. Need to find internet.
//   // If no system resources, remote is the preference.
//   // If no internet OR system resources, should probably check with the user first. Would ideally looking into ensuring it doesn't eat the whole processor, but just waits until available or something.
// };

// TODO:
// Would also like to train a model based on operation name, model config (e.g.
// gemini/flash, etc), system capacity availability (e.g. whether there is
// internet). For here, however, all that would simply be stored. Perhaps local
// database orchestration is worth doing first.
// In any case, the model selection will choose the next (non-excluded) model
// based on the parameters.
