import z from "zod";
import { serialisedModelSummarySchema } from "./model";
import { llmOperationIdentifierSchema, runtimeStringErrorCodes } from "./core";
import { getObjectKeys } from "@/shared/utilities";
import { llmHistoryRelativeSchema, llmHistorySummarySchemaValues } from "./summary";

const shape = {
  experimental: serialisedModelSummarySchema,
  name: z.string(),
  stable: serialisedModelSummarySchema,
};
/**
 * @deprecated Use `llmOperationSchema` instead.
 */
export const serialisedOperationSummarySchema = z.object(shape).catch({
  experimental: serialisedModelSummarySchema.parse({}),
  name: runtimeStringErrorCodes.UNREADABLE_PROPERTY,
  stable: serialisedModelSummarySchema.parse({}),
});

/**
 * @deprecated Use `llmOperationSchema` instead.
 */
export const serialisedOperationSummaryReliabilityKeys = getObjectKeys(
  shape
).filter(key => key !== 'name');
/**
 * @deprecated Use `LlmOperation` instead.
 */
const serialisedOperationSummaryReliabilitySchema = z.enum(
  serialisedOperationSummaryReliabilityKeys
);
/**
 * @deprecated Use `LlmOperation` instead.
 */
export type SerialisedOperationSummary = z.infer<typeof serialisedOperationSummarySchema>;
/**
 * @deprecated Use `LlmOperation` instead.
 */
export type SerialisedOperationSummaryReliability = z.infer<typeof serialisedOperationSummaryReliabilitySchema>;

// export const llmHistoryOperationSchema = llmHistorySummarySchemaValues.extend(
//   llmOperationIdentifierSchema
// );


export const llmOperationSchema = llmOperationIdentifierSchema.extend({
  models: z.array(llmHistoryRelativeSchema),
  updated: z.number(),
  // List of models for operation
  // ALL models in this collection for the operation should have the relative
  // data against other models for the collection.
  // At the moment that data is just the relative experience (runs) and
  // relative diversity (just local at the moment).
  // Stable models should have the most stable classification and highest
  // efficiency.
  // Experimental models have the most experimental classification, followed by
  // descending relative experience, followed by descending relative diversity.

  // The main usage is going to be:
  // Filters on whether there is a current internet connection (if not, use
  // local) and potentially other criteria later on.
  // Sorts based on either stable or experimental criteria.
  // Technically we don't *need* to store experimental/stable specifics, when
  // we can just list them against the operation.
});

export type LlmOperation = z.infer<typeof llmOperationSchema>;
