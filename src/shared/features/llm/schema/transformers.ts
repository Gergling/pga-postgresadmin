import z from "zod";
import { LlmCoreIdentifier, LlmCorePriority } from "./core";

export type LanguageModelTransformFunctionParamsDefault = {
  response: string;
  source: string;
};
export type LanguageModelTransformFunctionParams<T> = LanguageModelTransformFunctionParamsDefault & {
  schema?: z.ZodType<T>;
};

export type LanguageModelProps = LlmCoreIdentifier & {
  local: boolean; // TBH this is the only other thing we can reliably deduce and
  // use, so...
  priority?: LlmCorePriority;
  temperature?: number;
  thinking?: boolean;
  tokenLimits: {
    input?: number;
    output?: number;
  };
};
