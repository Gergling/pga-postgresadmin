import { Temporal } from "@js-temporal/polyfill";
import z from "zod";

/**
 * @deprecated Use dateSerialisationSchema instead.
 */
export const zonedDateTimeSchema = z.string().transform((val, ctx) => {
  try {
    return Temporal.ZonedDateTime.from(val);
  } catch (e) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid ISO ZonedDateTime",
    });
    return z.NEVER;
  }
}).default(Temporal.Now.zonedDateTimeISO());
