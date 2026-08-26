import { SerialisedModelSummary } from "../schema";
import {
  compareLlmModelsForExperimentation,
  compareLlmModelsForStability
} from "./utilities";

export const transformLlmModelSummaryFactory = (
  data: SerialisedModelSummary[]
) => {
  const sort = (experimental: boolean) => {
    const comparator = experimental
      ? compareLlmModelsForExperimentation
      : compareLlmModelsForStability;
    return [...data].sort(comparator);
  }

  return { data, sort };
};
