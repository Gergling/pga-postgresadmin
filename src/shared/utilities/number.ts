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
