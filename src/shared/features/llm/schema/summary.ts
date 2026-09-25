import z from "zod";
import { llmModelIdentifierSchema, llmOperationIdentifierSchema } from "./core";
import { llmHistoryClassificationSchema } from "./model";

const nonNegative = z.number().nonnegative();
const nonNegativeInt = nonNegative.int();

const summarisedRunSchema = z.object({
  failures: nonNegativeInt,
  retryable: nonNegativeInt,
  runtimes: z.array(nonNegativeInt).catch([]).describe(
    "A list of successful runtimes, in milliseconds"
  ),
});
export type LlmHistorySummarisedRuns = z.infer<typeof summarisedRunSchema>;
export const INITIAL_SUMMARISED_RUNS: LlmHistorySummarisedRuns = {
  failures: 0,
  retryable: 0,
  runtimes: [],
};

const summarisedAggregationSchema = z.object({
  successful: nonNegativeInt,
  terminal: nonNegativeInt.describe('Successful plus failed runs.'),
  total: nonNegativeInt,
});
export type LlmHistorySummarisedAggregation = z.infer<
  typeof summarisedAggregationSchema
>;
const summarisedSuccessSchema = z.object({
  efficiency: z.object({
    infrastucture: nonNegative,
    ux: nonNegative,
  }),
  rate: nonNegative,
  runtimes: z.object({
    mean: nonNegative,
    median: nonNegative,
    min: nonNegativeInt,
    max: nonNegativeInt,
  }),
});
export type LlmHistorySummarisedSuccess = z.infer<typeof summarisedSuccessSchema>;

export const llmHistorySummarySchemaValues = z.object({
  aggregation: summarisedAggregationSchema.optional(),
  classification: llmHistoryClassificationSchema.optional(),
  runs: summarisedRunSchema,
  success: summarisedSuccessSchema.optional(),
});

export const llmHistorySummarySchema = llmModelIdentifierSchema.extend(
  llmOperationIdentifierSchema.shape
).extend(llmHistorySummarySchemaValues.shape);
export type LlmHistorySummary = z.infer<typeof llmHistorySummarySchema>;

export const llmHistoryRelativeValuesSchema = z.object({
  divergence: z.number(),
  experience: z.number(),
});
export type LlmHistoryRelativeValues = z.infer<typeof llmHistoryRelativeValuesSchema>;
export const llmHistoryRelativeSchema = llmHistorySummarySchema.extend({
  relative: llmHistoryRelativeValuesSchema,
}).required();
export type LlmHistoryRelative = z.infer<typeof llmHistoryRelativeSchema>;
