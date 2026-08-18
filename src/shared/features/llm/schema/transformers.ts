import z from "zod";

export type LanguageModelTransformFunctionParamsDefault = {
  response: string;
  source: string;
};
export type LanguageModelTransformFunctionParams<T> = LanguageModelTransformFunctionParamsDefault & {
  schema?: z.ZodType<T>;
};

export type LanguageModelProps = {
  local: boolean;
  name: string;
  source: string;
  temperature?: number;
  thinking?: boolean;
  tokenLimits: {
    input?: number;
    output?: number;
  };
};

export type LanguageModelListFunction<T> = (
  preferred: string[],
  excluded: string[],
) => Promise<T>;
