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
