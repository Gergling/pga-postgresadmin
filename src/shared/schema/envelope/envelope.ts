import z, { ZodObject, ZodRawShape, ZodType } from "zod";
import { RichDate, richDateSchema, SerialisationDate, serialisationDateSchema } from "../date";

const auditEnvelopeSchemaFactory = <T extends ZodRawShape, U extends RichDate | SerialisationDate>(
  data: ZodObject<T>, dateSchema: ZodType<U>
) => z.object({
  data: data.partial(),
  updated: dateSchema.describe('This is the date when this data was last updated.'),
});

const baseFactory = <T extends ZodRawShape, U extends RichDate | SerialisationDate>(
  data: ZodObject<T>, dateSchema: ZodType<U>
) => z.object({
  audit: z.array(auditEnvelopeSchemaFactory(data, dateSchema)).default([]),
  created: dateSchema.describe('This is the date when the data was wrapped.'),
  data,
  id: z.string().default(() => crypto.randomUUID()),
  sync: z.number().optional().describe(
    'Last sync time in epochMilliseconds. Undefined means never synced.'
  ),
});
export type Envelope<T extends ZodRawShape, U extends RichDate | SerialisationDate> = z.infer<
  ReturnType<typeof baseFactory<T, U>>
>;

type EnvelopeSchemaFactoryParams<T extends ZodRawShape> = {
  data: ZodObject<T>;
  options?: {
    // foreign key property names, could provide an enum or just array of strings.
    // summary data has to be a property from the relationship
    relationships?: Record<string, ZodType>;
  };
};

const envelopeSchemaFactory = <
  U extends RichDate | SerialisationDate
>(
  dateSchema: ZodType<U>
) => <T extends ZodRawShape>({ data, options }: EnvelopeSchemaFactoryParams<T>) => {
  const summaryShape = options?.relationships ? Object.fromEntries(
    Object.entries(options.relationships).map(
      ([relatedProperty, value]) => [relatedProperty, value]
    )
  ) : {};
  return baseFactory<T, z.infer<typeof dateSchema>>(data, dateSchema).extend({
    summary: z.object(summaryShape).default({}),
  });
};

export const envelopeSerialisationSchemaFactory = <T extends ZodRawShape>(
  params: EnvelopeSchemaFactoryParams<T>
) => envelopeSchemaFactory(serialisationDateSchema)(params);
export type SerialisationEnvelope<T extends ZodRawShape> = z.infer<
  ReturnType<typeof envelopeSerialisationSchemaFactory<T>>
>;

export const envelopeRichSchemaFactory = <T extends ZodRawShape>(
  params: EnvelopeSchemaFactoryParams<T>
) => envelopeSchemaFactory(richDateSchema)(params);
export type RichEnvelope<T extends ZodRawShape> = z.infer<
  ReturnType<typeof envelopeRichSchemaFactory<T>>
>;
