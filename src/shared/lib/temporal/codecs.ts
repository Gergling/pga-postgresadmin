import { Temporal } from "@js-temporal/polyfill";
import z from "zod";
import {
  fallback,
  transformStringToRfc9557,
} from "@/shared/utilities";
import { temporalSchema } from "./schema";

/**
 * Returns a Regexp match on a string looking for a DD/MM/YYYY, HH:mm:ss date
 * string.
 * @param input A string.
 * @returns RegExpMatchArray | null that should include the values if the match
 * works.
 */
export const matchHumanReadableLocalString = (input: string) => {
  // Match the DD/MM/YYYY, HH:mm:ss pattern.
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2}):(\d{2})\s*(BST|GMT)$/;
  return input.match(regex);
};

export const stringToZDT = (raw: string) => fallback([
  () => {
    const str = fallback([
      () => {
        if (/\]$/.test(raw)) return raw;
        throw new Error('No timezone ID match');
      },
      () => transformStringToRfc9557(raw),
    ]);
    if (!str) throw new Error('No compatible string match');
    return Temporal.ZonedDateTime.from(str);
  },
  () => Temporal.Instant.from(raw).toZonedDateTimeISO("UTC"),
], `Failed to convert to ZonedDateTime: "${raw}"`);

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
