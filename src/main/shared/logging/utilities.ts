// Inter cogitationes eius nihil sumus.

import { hashFactory } from "@/shared/utilities";

export const getStdIoFormat = (
  input: unknown
): Parameters<typeof process.stdout.write>[0] => {
  if (typeof input === 'string') return input;
  if (input instanceof Error) return input.message;
  if (typeof input === 'object') return JSON.stringify(input, null, 2);
  return String(input);
};

const cipher = Array.from({ length: 10 }, (_, i) => i).join('') + Array.from(
  { length: 26 }, (_, i) => String.fromCharCode(97 + i)
).join('');

const codeFactory = hashFactory(2);

/**
 * Generates an arbitrary 4-letter code based on a large number.
 * @param n The number.
 * @returns 4-letter string.
 */
export const getCode = (n: number) => {
  const length = 4;
  const r = codeFactory() * (n + 1) * cipher.length * length;
  return Array.from({ length }, (_, i) => {
    const remainder = Math.floor(r * (i + n)) % cipher.length;
    return cipher[remainder];
  }).join('');
};
