import { LanguageModelHistoryBase } from "../schema";
import { ReduceLlmHistoryProps } from "../types";
import { incrementLlmHistorySummarisedStatus } from "./summary";

/**
 * @deprecated Use `incrementLlmHistorySummarisedStatus` instead.
 * @param acc 
 * @param param1 
 * @returns 
 */
export const reduceLlmHistory = (
  acc: ReduceLlmHistoryProps, {
    runtime, status
  }: LanguageModelHistoryBase
): ReduceLlmHistoryProps => {
  const { failureCount, retryableCount, successfulRuntimes } = acc;
  const response = incrementLlmHistorySummarisedStatus(
    {
      failures: failureCount,
      retryable: retryableCount,
      runtimes: successfulRuntimes
    }, { runtime, status }
  );

  return {
    failureCount: response.failures,
    retryableCount: response.retryable,
    successfulRuntimes: response.runtimes,
  };
};
