import { LanguageModelHistoryBase } from "../schema";
import { ReduceLlmHistoryProps } from "../types";

export const reduceLlmHistory = (
  acc: ReduceLlmHistoryProps, { runtime, status }: LanguageModelHistoryBase
) => {
  if (status === 'success') return {
    ...acc,
    successfulRuntimes: [...acc.successfulRuntimes, runtime],
  };
  if (['rate-limitations', 'traffic'].includes(status)) return {
    ...acc,
    retryableCount: acc.retryableCount + 1,
  };
  return {
    ...acc,
    failureCount: acc.failureCount + 1,
  };
};
