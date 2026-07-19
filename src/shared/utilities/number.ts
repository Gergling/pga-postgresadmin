import z from "zod";

/**
 * Encodes a string or number into a padded string.
 * @param padding The number of additional zeroes.
 * @returns A schema.
 */
export const padSchemaFactory = (padding: number) => z.union([
  z.number(), z.string()
]).transform((val) => {
  if (typeof val === 'string') {
    return val;
  }

  return val.toString().padStart(padding, '0');
});

const formatPercentageOptionsSchema = z.object({
  decimalPlaces: z.number(),
}).partial().default({ decimalPlaces: 2 });

type FormatPercentageOptions = z.infer<typeof formatPercentageOptionsSchema>;

export const formatPercentage = (
  fraction: number, options?: FormatPercentageOptions
) => {
  const {
    decimalPlaces,
  } = formatPercentageOptionsSchema.parse(options);
  return `${(fraction * 100).toFixed(decimalPlaces)}%`
};
