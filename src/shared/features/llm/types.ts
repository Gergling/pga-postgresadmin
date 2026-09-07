export type LlmInstruction = {
  abstract: string;
  context: string;
  instruction: string;
} | string;

export type ReduceLlmHistoryProps = {
  failureCount: number;
  retryableCount: number;
  successfulRuntimes: number[];
};
