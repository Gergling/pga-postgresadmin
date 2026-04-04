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

  const results: {
    [K in keyof T]?: LlmValidationResult<T[K]>;
  } = {};

  // We build the object as 'any' initially to populate keys, then cast to T.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatedObject: any = {};

  let success = true;

  for (const key of Object.keys(schema) as (keyof T)[]) {
    const validator = schema[key];
    const value = response[key];
    const result = validator(value);

    results[key] = result;
    if (!result.success) {
      success = false;
    }

    validatedObject[key] = result.value;
  }

  return { results: results as {
    [K in keyof T]: LlmValidationResult<T[K]>;
  }, success, value: validatedObject };
};

const parseLanguageModelReponseString = (responseText: string) => {
  const cleanedJson = responseText.replace(/```json|```/g, "").trim();
  try {
    const response = JSON.parse(cleanedJson);
    return response;
  } catch (error) {
    console.error("Error parsing JSON:", responseText, cleanedJson, error);
    throw error;
  }
};

export const parseLanguageModelResponse = <T extends object>(
  responseText: string,
  proposedTaskAnalysisResponseSchema: LlmResponseSchema<T>
): LlmValidationResult<T> => {
  const response = parseLanguageModelReponseString(responseText);
  const validation = validateLanguageModelResponse(response, proposedTaskAnalysisResponseSchema);

  return validation;
}
