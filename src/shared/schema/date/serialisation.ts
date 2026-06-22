import { Temporal } from "@js-temporal/polyfill";
import z from "zod";
import { TemporalTransformResponseBase } from "./base";
import { transformToZonedDateTime } from "./transformers";

const serialisationDatePipeSchema = z.object({
  epochMilliseconds: z.number(),
  timeZoneId: z.string(),
});

type DateTransformSerialisationResponse = TemporalTransformResponseBase<
  z.infer<typeof serialisationDatePipeSchema>
>;

export const transformToSerialisationDate = (
  value: unknown
): DateTransformSerialisationResponse => {
  const zdt = transformToZonedDateTime(value);
  if (zdt.type === 'success') {
    return {
      type: 'success',
      value: {
        epochMilliseconds: zdt.value.epochMilliseconds,
        timeZoneId: zdt.value.timeZoneId,
      }
    };
  }
  return zdt;
};

export const serialisationDateSchema = z.unknown().transform((value, ctx) => {
  const serialised = transformToSerialisationDate(value);
  if (serialised.type === 'error') {
    ctx.addIssue({
      code: 'custom',
      expected: JSON.stringify(serialised.errors),
      message: 'Invalid date format.',
      received: value,
    });
    return;
  }
  return serialised.value;
}).pipe(serialisationDatePipeSchema).default(
  () => {
    const now = Temporal.Now.zonedDateTimeISO();
    return {
      epochMilliseconds: now.epochMilliseconds,
      timeZoneId: now.timeZoneId.toString(),
    };
  }
);

export type SerialisationDate = z.infer<typeof serialisationDateSchema>;
