import z from "zod";
import { LanguageModelGeneratorResponse } from "@/shared/features/llm";
import { LogApi } from "@/main/shared/logging";

export type LanguageModelGeneratorFunctionParams = {
  prompt: string; schema?: z.ZodType; temperature: number; logApi: LogApi;
};

export type LanguageModelGeneratorFunction = (
  props: LanguageModelGeneratorFunctionParams
) => Promise<LanguageModelGeneratorResponse>;
