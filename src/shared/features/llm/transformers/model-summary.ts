import { mean, median } from "@/shared/utilities";
import {
  SerialisedModelSummary,
  SerialisedModelSummaryValues
} from "../schema";
import { ReduceLlmHistoryProps } from "../types";
import {
  compareLlmModelsForExperimentation,
  compareLlmModelsForStability,
  getModelActionClassification
} from "./utilities";
import { getModelEfficiency } from "../utilities";

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

export const getModelGroupValues = ({
  failureCount,
  retryableCount,
  successfulRuntimes
}: ReduceLlmHistoryProps): SerialisedModelSummaryValues => {
  const successCount = successfulRuntimes.length;
  // Perhaps include different types of count.
  const success = successCount + failureCount;
  const count = {
    all: retryableCount + success,
    success,
  };
  const rate = successCount / count.success;
  const classification = getModelActionClassification({
    failureCount, retryableCount, successCount
  });
  const runtime = {
    mean: mean(successfulRuntimes),
    median: median(successfulRuntimes),
  }
  const efficiency = getModelEfficiency({
    rate, runtime
  });

  return {
    classification,
    count,
    efficiency,
    rate,
    runtime,
  };
};
