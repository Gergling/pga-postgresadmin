import z from "zod";
import { padSchemaFactory } from "./number";

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

export const transformStringToRfc9557 = (raw: string) => {
  const match = raw.match(/(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{1,2}):(\d{2}):(\d{2})/);
  if (!match) throw new Error("Format is not DD/MM/YYYY, HH:mm:ss.");

  const [_, day, month, year, hour, minute, second] = match;
  // const paddedHour = hour.padStart(2, '0');

  // Determine offset based on your known timezone rules (e.g., BST is UTC+1)
  const isBST = raw.includes("BST");
  const offset = isBST ? "+01:00" : "+00:00";
  const tzName = isBST ? "[Europe/London]" : "[UTC]";

  return transformToRfc9557({ year, month, day, hour, minute, second, offset, tzName });
};
