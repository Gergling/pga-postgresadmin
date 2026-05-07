import z from "zod";
import { LanguageModelGeneratorResponse } from "./schema";

export type LanguageModelGeneratorFunctionParams = {
  prompt: string; schema?: z.ZodType; temperature: number;
};

export type LanguageModelGeneratorFunction = (
  props: LanguageModelGeneratorFunctionParams
) => Promise<LanguageModelGeneratorResponse>;

export type LanguageModelTransformFunctionParamsDefault = {
  response: string;
  source: string;
};
export type LanguageModelTransformFunctionParams<T> = LanguageModelTransformFunctionParamsDefault & {
  schema?: z.ZodType<T>;
};

export type LanguageModelProps = {
  name: string;
  source: string;
  temperature?: number;
  thinking: boolean;
  tokenLimits: {
    input?: number;
    output?: number;
  };
};

export type LanguageModelListFunction<T> = (
  preferred: string[],
  excluded: string[],
) => Promise<T>;
