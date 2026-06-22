import { Temporal } from "@js-temporal/polyfill";
import z from "zod";
import { transformToZonedDateTime } from "./transformers";

export const richDateSchema = z.unknown().transform((value, ctx) => {
  const zdt = transformToZonedDateTime(value);
  if (zdt.type === 'error') {
    ctx.addIssue({
      code: 'custom',
      message: 'Invalid date format.',
      received: value,
    });
    return;
  }
  return zdt.value;
}).pipe(
  z.instanceof(Temporal.ZonedDateTime)
);

export type RichDate = z.infer<typeof richDateSchema>;
