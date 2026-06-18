import z from "zod";
import { Temporal } from "@js-temporal/polyfill";

export const temporalSchema = z.object({
  raw: z.string(),
  zonedDateTime: z.instanceof(Temporal.ZonedDateTime),
});
export type TemporalSchema = z.infer<typeof temporalSchema>;
