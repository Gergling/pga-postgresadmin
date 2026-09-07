import z from "zod";
import { parserFactory } from "@/shared/schema";
import {
  LlmCoreIdentifier,
  llmCoreIdentifierSchema,
  runtimeNumericErrorCodes,
  runtimeStringErrorCodes
} from "./core";

const modelClassificationSchema = z.enum([
  'no-data',
  'potential',
  'retryable',
  'stable',
  'unsuccessful',
  'unreliable',
]);

export type ModelClassification = z.infer<typeof modelClassificationSchema>;

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

export const serialisedModelSummarySchema = llmCoreIdentifierSchema.def.innerType.extend({
  classification: modelClassificationSchema.catch('no-data'),
  count: z.unknown().transform(
    (value) => count.parse({ success: typeof value === 'number' ? value : undefined })
  ).pipe(count),
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
