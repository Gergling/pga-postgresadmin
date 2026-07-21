import {
  LanguageModelTransformFunctionParams,
} from "../types";
import { errorSchema } from "@shared/schema/error";

const jsonParse = (response: string) => {
  try {
    return JSON.parse(response);
  } catch (e) {
    console.error(errorSchema.parse(e));
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
