import { Temporal } from "@js-temporal/polyfill";
import z from "zod";
import { temporalSchema } from "./schema";

const stringToZDT = (raw: string) => {
  const hasTimeZoneId = /\]$/.test(raw);

  if (hasTimeZoneId) {
    // Safely parse directly as ZonedDateTime
    return Temporal.ZonedDateTime.from(raw);
  }

  // Fallback: Parse as a global Instant, then attach the UTC time zone
  return Temporal.Instant.from(raw).toZonedDateTimeISO("UTC");
};

/**
 * Converts between string and Temporal.ZonedDateTime.
 */
export const temporalCodec = z.codec(
  z.string(),
  temporalSchema,
  {
    decode: (raw) => ({ raw, zonedDateTime: stringToZDT(raw) }),
    encode: ({ zonedDateTime }) => zonedDateTime.toInstant().toString(),
  }
);
