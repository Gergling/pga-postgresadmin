import {
  LanguageModelSourceLevelResponse,
  log,
} from "@/main/shared";
import { ApiError } from "@google/genai";
import z from "zod";

const ApiErrorInfoSchema = z.object({
  message: z.string(),
  status: z.number(),
});

export const catchGeminiError = (
  caught: unknown,
  model: string,
): LanguageModelSourceLevelResponse => {
  if (typeof caught !== 'object' || caught === null) throw caught;
  
  const apiErrorInfo = ApiErrorInfoSchema.safeParse(caught);
  if (apiErrorInfo.success) {
    const apiError = new ApiError(apiErrorInfo.data);
    switch(apiError.status) {
      case 503: return {
        canRetry: true,
        model,
        status: 'traffic',
      };
      case 429: 
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
        log('Gemini 429 error. Could not parse message as JSON.', 'error');
        console.error(apiError, caught, e);
      }
      return {
        canRetry: true,
        model,
        status: 'rate-limitations',
      };
    }
  } else {
    console.error(`Error is not an ApiErrorInfo object.`);
  }

  log(`Available error object keys:`, 'error');
  console.error(Object.keys(caught))

  throw caught;
}
