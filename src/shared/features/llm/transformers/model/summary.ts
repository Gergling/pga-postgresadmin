import { mean, median } from "@/shared/utilities";
import {
  SerialisedModelSummary,
  SerialisedModelSummaryValues
} from "../../schema";
import { ReduceLlmHistoryProps } from "../../types";
import { getModelEfficiency } from "../../utilities";
import { getModelActionClassification } from "./classification";
import {
  compareLlmModelFactory,
} from "./comparators";

export const transformLlmModelSummaryFactory = (
  data: SerialisedModelSummary[]
) => {
  const sort = (experimental: boolean) => {
    const comparator = compareLlmModelFactory(!experimental);
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
