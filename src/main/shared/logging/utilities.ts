// Inter cogitationes eius nihil sumus.

import { hashFactory } from "@/shared/utilities";
import { TASK_STATUS_PROPAGATION_ORDER } from "./constants";
import { TaskStatus } from "./config";

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

/**
 * Generates an arbitrary 4-letter code based on a large number.
 * @param n The number.
 * @returns 4-letter string.
 */
export const getCode = (n: number) => {
  const length = 4;
  return Array.from({ length }, (_, idx) => {
    const denominator = Math.pow(cipher.length, idx);
    const remainder = Math.floor(n / denominator) % cipher.length;
    return cipher[remainder];
  }).join('');
};

export const shouldPropagateStatus = (
  oldStatus: TaskStatus,
  newStatus: TaskStatus
) => {
  const oldIndex = TASK_STATUS_PROPAGATION_ORDER.indexOf(oldStatus);
  const newIndex = TASK_STATUS_PROPAGATION_ORDER.indexOf(newStatus);
  return newIndex < oldIndex;
};
