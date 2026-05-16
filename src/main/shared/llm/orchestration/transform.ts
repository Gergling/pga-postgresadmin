import { log } from "@main/shared/logging";
import {
  LanguageModelTransformFunctionParams,
} from "../types";

const jsonParse = (response: string) => {
  try {
    return JSON.parse(response);
  } catch (e) {
    log('JSON parsing response failed', 'error');
    throw e;
  }
}

export const transformLanguageModelResponse = <T>({
  response, schema
}: LanguageModelTransformFunctionParams<T>): T | string | undefined => {
  if (!schema) return response;

  try {
    const parsed = jsonParse(response);
    return schema.parse(parsed);
  } catch (e) {
    console.error(e);
    return;
  }
};
