export type LlmInstruction = {
  abstract: string;
  context: string;
  instruction: string;
} | string;