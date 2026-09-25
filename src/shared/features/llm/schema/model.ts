import z from "zod";
import { parserFactory } from "@/shared/schema";
import {
  LlmCoreIdentifier,
  llmCoreIdentifierSchema,
  llmModelIdentifierSchema,
  runtimeNumericErrorCodes,
  runtimeStringErrorCodes
} from "./core";

export const llmHistoryClassificationSchema = z.enum([
  /**
   * @deprecated Use `untested` instead.
   */
  'no-data',
  'potential',
  /**
   * @deprecated
   */
  'retryable',
  'stable',
  'unreliable',
  'unsuccessful',
  'untested',
]);

export type LlmHistoryClassification = z.infer<typeof llmHistoryClassificationSchema>;
/**
 * @deprecated Use {@link LlmHistoryClassification} instead.
 * @alias LlmHistoryClassification
 */
export type ModelClassification = LlmHistoryClassification;

export const llmSummarySchema = llmModelIdentifierSchema.extend({
  traits: z.object({
    local: z.boolean(),
  }),
  operations: z.array(
    z.object({
      name: z.string(),
      stable: z.boolean(),
    })
  ),
  updated: z.object({
    fetch: z.number(),
    summarisation: z.number().optional(),
  }),
});

export type LlmSummary = z.infer<typeof llmSummarySchema>;

const serialisedModelSummaryEfficiency = z.object({
  infrastucture: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  ux: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
}).catch({
  infrastucture: runtimeNumericErrorCodes.UNREADABLE_PROPERTY,
  ux: runtimeNumericErrorCodes.UNREADABLE_PROPERTY,
});

const count = z.object({
  all: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  success: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
});

/**
 * @deprecated
 */
export const serialisedModelSummarySchema = llmCoreIdentifierSchema.def.innerType.extend({
  classification: llmHistoryClassificationSchema.catch('no-data'),
  count: count.catch(
    (value) => ({
      success: typeof value === 'number' ? value : runtimeNumericErrorCodes.UNREADABLE_PROPERTY,
      all: runtimeNumericErrorCodes.UNREADABLE_PROPERTY
    })
  ),
  // count: z.unknown().transform(
  //   (value) => count.parse({ success: typeof value === 'number' ? value : undefined })
  // ).pipe(count),
  efficiency: serialisedModelSummaryEfficiency,
  rate: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  runtime: z.object({
    mean: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
    median: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  }),
}).catch({
  classification: 'no-data',
  count: count.parse({}),
  efficiency: {
    ux: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
    infrastucture: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
  },
  name: runtimeStringErrorCodes.IRRETRIEVABLE_RECORD,
  rate: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
  runtime: {
    mean: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
    median: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
  },
  source: runtimeStringErrorCodes.IRRETRIEVABLE_RECORD,
});

export type SerialisedModelSummary = z.infer<typeof serialisedModelSummarySchema>;

export const serialisedModelSummarySchemaParser = parserFactory({
  fallback: serialisedModelSummarySchema.parse({}),
  schema: serialisedModelSummarySchema,
});

export type SerialisedModelSummaryParsed = ReturnType<typeof serialisedModelSummarySchemaParser>;

/**
 * @deprecated
 */
export type SerialisedModelSummaryValues = Omit<
  SerialisedModelSummary, 'name' | 'source'
>;

export type LanguageModelListFunctionParams<LogApi> = {
  excluded: LlmCoreIdentifier[];
  logApi: LogApi;
  preferred: LlmCoreIdentifier[];
};
export type LanguageModelListFunction<T, LogApi> = (
  props: LanguageModelListFunctionParams<LogApi>
) => Promise<T>;
