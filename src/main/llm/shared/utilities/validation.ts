import { LlmResponseSchema, LlmValidationResult } from "../types";

export const validateLanguageModelResponseArray = <T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
  itemSchema: LlmResponseSchema<T>
): LlmValidationResult<T[]> => {
  if (!Array.isArray(response)) {
    return { message: 'Response is not an array', success: false, value: [] };
  }

  const validatedItems: T[] = [];

  for (let i = 0; i < response.length; i++) {
    const item = response[i];
    const result = validateLanguageModelResponse(item, itemSchema);

    if (!result.success) {
      return {
        success: false,
        message: `Item at index ${i} invalid: ${result.message}`,
        value: []
      };
    }
    validatedItems.push(result.value);
  }

  return { success: true, value: validatedItems };
};

export const validateLanguageModelResponse = <T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any,
  schema: LlmResponseSchema<T>
): LlmValidationResult<T> => {
  if (typeof response !== 'object' || response === null) {
    return { success: false, message: 'Response is not an object' };
  }

  // We build the object as 'any' initially to populate keys, then cast to T.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatedObject: any = {};

  for (const key of Object.keys(schema) as (keyof T)[]) {
    const validator = schema[key];
    const value = response[key];
    const result = validator(value);

    if (!result.success) {
      return {
        success: false,
        message: `Property '${String(key)}' invalid: ${result.message}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: result.value as any
      };
    }
    validatedObject[key] = result.value;
  }

  return { success: true, value: validatedObject };
};
