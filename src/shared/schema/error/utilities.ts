import z from "zod";
import { GeneralError } from "./schemas";

type ErrorConfigItem = {
  schema: z.ZodType,
  transformer: (data: unknown, e: unknown) => GeneralError
};

export const createErrorConfig = <T extends ErrorConfigItem[]>(arr: T) => arr;

export const safeErrorParse = <T, U>(
  schema: z.ZodType<T>,
  e: U,
  transformer: (data: T, e: U) => GeneralError
): GeneralError | undefined => {
  const result = schema.safeParse(e);
  if (result.success) {
    return transformer(result.data, e);
  }
};
