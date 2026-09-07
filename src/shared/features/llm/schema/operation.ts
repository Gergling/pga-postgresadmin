import z from "zod";
import { serialisedModelSummarySchema } from "./model";
import { runtimeStringErrorCodes } from "./core";
import { getObjectKeys } from "@/shared/utilities";

const shape = {
  experimental: serialisedModelSummarySchema,
  name: z.string(),
  stable: serialisedModelSummarySchema,
};

export const serialisedOperationSummarySchema = z.object(shape).catch({
  experimental: serialisedModelSummarySchema.parse({}),
  name: runtimeStringErrorCodes.UNREADABLE_PROPERTY,
  stable: serialisedModelSummarySchema.parse({}),
});

export const serialisedOperationSummaryReliabilityKeys = getObjectKeys(
  shape
).filter(key => key !== 'name');
const serialisedOperationSummaryReliabilitySchema = z.enum(
  serialisedOperationSummaryReliabilityKeys
);
export type SerialisedOperationSummary = z.infer<typeof serialisedOperationSummarySchema>;
export type SerialisedOperationSummaryReliability = z.infer<typeof serialisedOperationSummaryReliabilitySchema>;
