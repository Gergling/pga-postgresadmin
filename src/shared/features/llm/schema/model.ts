import z from "zod";
import {
  LlmCoreIdentifier,
  llmCoreIdentifierSchema,
  runtimeNumericErrorCodes,
  runtimeStringErrorCodes
} from "./core";
import { LogApi } from "@/main/shared";

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

export const serialisedModelSummarySchema = llmCoreIdentifierSchema.def.innerType.extend({
  classification: modelClassificationSchema.catch('no-data'),
  count: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  efficiency: serialisedModelSummaryEfficiency,
  rate: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  runtime: z.object({
    mean: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
    median: z.number().catch(runtimeNumericErrorCodes.UNREADABLE_PROPERTY),
  }),
}).catch({
  classification: 'no-data',
  count: runtimeNumericErrorCodes.IRRETRIEVABLE_RECORD,
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

export type LanguageModelListFunctionParams = {
  excluded: LlmCoreIdentifier[];
  logApi: LogApi;
  preferred: LlmCoreIdentifier[];
};
export type LanguageModelListFunction<T> = (
  props: LanguageModelListFunctionParams
) => Promise<T>;
