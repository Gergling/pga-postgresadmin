import { mean, median } from "@/shared/utilities";
import {
  LlmHistoryRelative,
  SerialisedModelSummaryValues
} from "../../schema";
import { ReduceLlmHistoryProps } from "../../types";
import { getModelEfficiency } from "../../utilities";
import { getModelActionClassification } from "../summary/classification";
import {
  compareLlmModelsForExperimentation,
  compareLlmModelsForStability
} from "../summary";

export const transformLlmModelSummaryFactory = (
  data: LlmHistoryRelative[]
) => {
  const experimental = compareLlmModelsForExperimentation.sort(data);
  const stable = compareLlmModelsForStability.sort(data);

  return { experimental, stable };
};

/**
 * @deprecated
 */
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
