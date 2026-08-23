import z from "zod";

export type LlmAnalyserParamsOptions<CompletionProps> = {
  retryOnStringResponse?: boolean;
  schema?: z.ZodType<CompletionProps>;
};
