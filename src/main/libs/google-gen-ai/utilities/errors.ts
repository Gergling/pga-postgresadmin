import { ApiError } from "@google/genai";
import z from "zod";
import { LanguageModelSourceLevelResponse } from "@/shared/features/llm";
import {
  log,
  LogApi,
} from "@/main/shared";

const ApiErrorInfoSchema = z.object({
  status: z.number(),
});
const ApiErrorInfoSchemaWithMessage = ApiErrorInfoSchema.extend({
  message: z.string(),
});

export const catchGeminiError = (
  caught: unknown,
  model: string,
  { setStatus }: LogApi
): LanguageModelSourceLevelResponse => {
  if (typeof caught !== 'object' || caught === null) {
    setStatus('error', 'Caught error is not an object.');
    throw caught;
  }

  const apiErrorInfo = ApiErrorInfoSchema.safeParse(caught);
  if (apiErrorInfo.success) {
    switch (apiErrorInfo.data.status) {
      case 503: return {
        canRetry: true,
        model,
        status: 'traffic',
      };
      case 429:
        const apiErrorInfoWithMessage = ApiErrorInfoSchemaWithMessage.safeParse(caught);
        if (apiErrorInfoWithMessage.success) {
          const apiError = new ApiError(apiErrorInfoWithMessage.data);
          try {
            const parsed = JSON.parse(apiError.message);
            const reduced = parsed.error.details.reduce((acc: any, detail: any) => {
              switch (detail['@type']) {
                case 'type.googleapis.com/google.rpc.QuotaFailure': return {
                  ...acc,
                  violations: detail.violations,
                };
                case 'type.googleapis.com/google.rpc.RetryInfo': return {
                  ...acc,
                  retryDelay: detail.retryDelay.replace('s', '') * 1,
                };
              }
            }, { retryDelay: 0, violations: [] } as {
              // TODO: Update violations to be an actual type instead of this static nonsense.
              retryDelay: number, violations: {
                quotaMetric: 'generativelanguage.googleapis.com/generate_content_free_tier_requests',
                quotaId: 'GenerateRequestsPerDayPerProjectPerModel-FreeTier',
                quotaDimensions: { location: 'global', model: 'gemini-3-flash' },
                quotaValue: '20'
              }[],
            });
            return {
              canRetry: true,
              model,
              retryTimeout: reduced.retryDelay,
              status: 'rate-limitations',
            }
          } catch (e) {
            setStatus('error', 'Gemini 429 error. Could not parse message as JSON.');
            console.error(apiError, caught, e);
          }
          return {
            canRetry: true,
            model,
            status: 'rate-limitations',
          };
        } else {
          console.error(`Error is not compatible with ApiError.`);
        }
      // TODO: In theory we can put in a 404 catcher and use it as a warning
      // system that the gemini library needs a version update.
      default: {
        return {
          canRetry: false,
          model,
          message: `Unexpected error status: ${apiErrorInfo.data.status}`,
          status: 'unexpected',
        }
      }
    }
  } else {
    console.error(`Error is not an ApiErrorInfo object`)
  }

  setStatus('error', `Error response was difficult to parse. Available error object keys:`);
  console.error(Object.keys(caught))

  throw caught;
}
