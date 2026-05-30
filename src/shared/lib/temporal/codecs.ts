import { Temporal } from "@js-temporal/polyfill";
import z from "zod";
import { temporalSchema } from "./schema";

const matchHumanReadableLocalString = (input: string) => {
  // Match the DD, MM, YYYY, HH, mm, and ss patterns
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2}):(\d{2})\s*(BST|GMT)$/;
  return input.match(regex);
}

const humanReadableLocalStringToZDT = (match: RegExpMatchArray) => {
  // Destructure the regex matches into numeric segments
  const [, day, month, year, hour, minute, second, tzAbbr] = match;

  // Map local UK abbreviations to an IANA time zone identifier
  const timeZone = tzAbbr === "BST" || tzAbbr === "GMT" ? "Europe/London" : "UTC";

  return Temporal.ZonedDateTime.from({
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
    second: parseInt(second, 10),
    timeZone: timeZone
  });
}

const stringToZDT = (raw: string) => {
  const isHumanReadableLocalString = matchHumanReadableLocalString(raw);
  if (isHumanReadableLocalString) {
    return humanReadableLocalStringToZDT(isHumanReadableLocalString);
  }

  const hasTimeZoneId = /\]$/.test(raw);

  if (hasTimeZoneId) {
    // Safely parse directly as ZonedDateTime
    return Temporal.ZonedDateTime.from(raw);
  }

  // Fallback: Parse as a global Instant, then attach the UTC time zone
  return Temporal.Instant.from(raw).toZonedDateTimeISO("UTC");
};

/**
 * Encodes Temporal.ZonedDateTime into a string.
 */
export const temporalCodec = z.codec(
  z.string(),
  temporalSchema,
  {
    decode: (raw) => ({ raw, zonedDateTime: stringToZDT(raw) }),
    encode: ({ zonedDateTime }) => zonedDateTime.toString(),
  }
);
