import {
  LanguageModelErrorResponse,
  LanguageModelErrorType,
  LanguageModelResponse
} from "@main/shared/llm";
import { mapLanguageModelError } from "@main/shared/llm/utilities";
import { log } from "@main/shared/logging";

export const mapGeminiError = (
  type: LanguageModelErrorType,
  data?: object,
): LanguageModelErrorResponse => mapLanguageModelError({
  data: data ?? {},
  source: 'gemini',
  type,
});
export const stringifyGeminiError = (
  type: LanguageModelErrorType
): string => JSON.stringify(mapGeminiError(type));

const handleGeminiErrorStatus = (
  caught: unknown,
  model: string | undefined,
  status: unknown
): LanguageModelResponse => {
  // Special handler for high-traffic.
  if (status === 503) {
    log(`Gemini model had too much traffic (503).`, 'error');
    if (model) {
      return {
        model,
        type: 'traffic',
      };
    }
    log(`...And yet there was no Gemini model available.`, 'error');
    throw caught;
  }
  if (status === 429) {
    log(`Gemini called too many times (429).`, 'error');
    throw caught;
    // IF this is a "too many times today" message, fallback.
    // Otherwise, we assume this is a "too many times in a minute"
    // message, and exponentially back-off.
  }
  log(`Error status: ${status}`, 'error');
  throw caught;
};

export const transformGeminiError = (
  caught: unknown,
  model: string | undefined,
): LanguageModelResponse => {
  // If it's not an object, we just throw.
  if (typeof caught !== 'object' || caught === null) {
    log('Gemini Call Error:', 'error');
    console.error(caught);
    throw caught;
  }

  // If we can break down the error, we do, or we just throw.
  log('Caught a Gemini call Error. It was an object type.', 'error');
  if ('status' in caught) {
    return handleGeminiErrorStatus(caught, model, caught.status);
  } else {
    log(`No status code available.`, 'error');
  }

  if ('error' in caught) {
    log(`Error message:`, 'error');
    console.error(caught.error);
  } else {
    log(`No error property available.`, 'error');
  }

  log(`Available error object keys:`, 'error');
  console.error(Object.keys(caught))

  throw caught;
};
