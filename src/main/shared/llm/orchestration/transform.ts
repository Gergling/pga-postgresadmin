import {
  LanguageModelTransformFunctionParams,
} from "../types";

export const transformLanguageModelResponse = <T>({
  response, schema
}: LanguageModelTransformFunctionParams<T>): T | string | undefined => {
  if (!schema) return response;

  try {
    const parsed = JSON.parse(response);
    return schema.parse(parsed);
  } catch (e) {
    console.error(e);
    return;
  }
};
