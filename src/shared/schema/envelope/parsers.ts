import z from "zod";
import { parserFactory } from "../database";
import { serialisationDateNow, serialisationDateSchema } from "../date";
import { Envelope, EnvelopeSchema } from "./envelope";
import { Temporal } from "@js-temporal/polyfill";

export const envelopeParserFactory = <T extends z.ZodObject>({
  dataSchema, ...props
}: {
  dataSchema: T;
  fallback: z.infer<T>;
}) => {
  const schema = z.object({
    audit: z.array(z.object({
      data: dataSchema.partial(),
      updated: serialisationDateSchema.describe('This is the date when this data was last updated.'),
    })).default([]),
    created: serialisationDateSchema.describe('This is the date when the data was wrapped.'),
    data: dataSchema,
    id: z.string().default(() => crypto.randomUUID()),
    sync: z.number().optional().describe(
      'Last sync time in epochMilliseconds. Undefined means never synced.'
    ),
  });
  const fallback = schema.parse({
    data: props.fallback
  })
  const parser = parserFactory({
    fallback,
    schema
  });

  return { parser };
};

export const createNewEnvelope = <T extends EnvelopeSchema>(
  schema: T, data: z.infer<T>['data'],
  now: Temporal.ZonedDateTime = Temporal.Now.zonedDateTimeISO()
) => schema.parse({ created: serialisationDateNow(now), data });
