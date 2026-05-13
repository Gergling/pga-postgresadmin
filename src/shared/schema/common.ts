import { Temporal } from "@js-temporal/polyfill";
import z from "zod";

export const dateSchema = z.string().default(
  Temporal.Now.zonedDateTimeISO().toLocaleString()
);
