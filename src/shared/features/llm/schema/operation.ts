import z from "zod";
import { serialisedModelSummarySchema } from "./model";
import { runtimeStringErrorCodes } from "./core";

export const serialisedOperationSummarySchema = z.object({
  experimental: serialisedModelSummarySchema,
  name: z.string(),
  stable: serialisedModelSummarySchema,
}).catch({
  experimental: serialisedModelSummarySchema.parse({}),
  name: runtimeStringErrorCodes.UNREADABLE_PROPERTY,
  stable: serialisedModelSummarySchema.parse({}),
});

export type SerialisedOperationSummary = z.infer<typeof serialisedOperationSummarySchema>;
