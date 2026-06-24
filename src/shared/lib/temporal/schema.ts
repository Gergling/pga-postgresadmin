import z from "zod";
import { Temporal } from "@js-temporal/polyfill";

/**
 * @deprecated Use temporalSchema instead.
 */
export const temporalLegacySchema = z.object({
  raw: z.string(),
  zonedDateTime: z.instanceof(Temporal.ZonedDateTime),
});
export type TemporalLegacySchema = z.infer<typeof temporalLegacySchema>;
