import { LanguageModelHistoryBase } from "../schema";

export type ReduceLlmHistoryProps = {
  failureCount: 0, retryableCount: 0, successfulRuntimes: []
};

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
