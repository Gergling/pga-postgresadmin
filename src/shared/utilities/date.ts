import z from "zod";
import { padSchemaFactory } from "./number";

export function resolveAbbreviation(abbreviation: string, year: number): string {
  // Normalize common aliases standardizing to universal equivalents
  if (abbreviation === 'BST' || abbreviation === 'GMT') return 'Europe/London';

  // Get all supported IANA time zones from the runtime engine
  // @ts-ignore - Intl.supportedValuesOf is available in modern JS/TS environments
  const allZones: string[] = Intl.supportedValuesOf('timeZone');

  // Test a sample date in the given year to see which zone produces your abbreviation
  const sampleDate = new Date(year, 5, 1); // June 1st (captures summer time)
  const sampleDateWinter = new Date(year, 11, 1); // Dec 1st (captures winter time)

  for (const zone of allZones) {
    const formatter = new Intl.DateTimeFormat('en-UK', { timeZone: zone, timeZoneName: 'short' });
    const formattedSummer = formatter.format(sampleDate);
    const formattedWinter = formatter.format(sampleDateWinter);

    // Check if this zone matches your abbreviation in summer or winter
    if (formattedSummer.includes(abbreviation) ||
      formattedWinter.includes(abbreviation)) {
      return zone;
    }
  }

  throw new Error(`Could not automatically resolve timezone abbreviation: "${abbreviation}"`);
}

const padProps = ['month', 'day', 'hour', 'minute', 'second'] as const;
type PadProps = typeof padProps[number];

const rfc9557ObjectSchema = z.object({
  year: padSchemaFactory(4),
  offset: z.string(),
  tzName: z.string(),
}).extend(padProps.reduce((acc, prop) => ({
  ...acc, [prop]: padSchemaFactory(2)
}), {} as Record<PadProps, z.ZodType<string, string | number>>));

// type Rfc9557ObjectSchema = z.infer<typeof rfc9557ObjectSchema>;
export type Rfc9557ObjectSchemaInput = z.input<typeof rfc9557ObjectSchema>;

/**
 * Takes an object breakdown of number or string date components and returns an
 * RFC 9557 string output.
 * @param props An object of date components.
 * @returns The RFC string.
 */
export const transformToRfc9557 = (
  props: Rfc9557ObjectSchemaInput
): string => {
  const {
    year, month, day, hour, minute, second, offset, tzName,
  } = rfc9557ObjectSchema.parse(props);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}${tzName}`;
}

export const transformStringToRfc9557Object = (
  raw: string
): Rfc9557ObjectSchemaInput => {
  const match = raw.match(
    /(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})\s([A-Z]{3,4})/
  );
  if (!match) throw new Error("Format is not DD/MM/YYYY, HH:mm:ss.");

  const [, day, month, year, hour, minute, second, abbreviation] = match;
  const resolved = resolveAbbreviation(abbreviation, parseInt(year));
  const tzName = `[${resolved}]`;

  // Determine offset based on your known timezone rules (e.g., BST is UTC+1)
  const isBST = raw.includes("BST");
  const offset = isBST ? "+01:00" : "+00:00";

  return { year, month, day, hour, minute, second, offset, tzName };
};

export const transformStringToRfc9557 = (raw: string) => {
  const match = raw.match(
    /(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})(?:\s([A-Z]{3,4}))?/
  );
  if (!match) throw new Error("Format is not DD/MM/YYYY, HH:mm:ss.");

  const [, day, month, year, hour, minute, second, abbreviation] = match;
  const resolved = abbreviation ? resolveAbbreviation(abbreviation, parseInt(year)) : 'UTC';
  const tzName = `[${resolved}]`;

  // Determine offset based on your known timezone rules (e.g., BST is UTC+1)
  const isBST = raw.includes("BST");
  const offset = isBST ? "+01:00" : "+00:00";

  return transformToRfc9557({ year, month, day, hour, minute, second, offset, tzName });
};
