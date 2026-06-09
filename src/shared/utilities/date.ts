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
 * What do I want?
 * I want the RFC string output.
 * I want to put in *whatever*.
 */

export const transformToRfc9557 = (
  props: Rfc9557ObjectSchemaInput
): string => {
  const {
    year, month, day, hour, minute, second, offset, tzName,
  } = rfc9557ObjectSchema.parse(props);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offset}${tzName}`;
}
