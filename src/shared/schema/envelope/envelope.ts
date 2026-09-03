import z, { ZodObject, ZodType } from "zod";
import {
  RichDate,
  richDateSchema,
  SerialisationDate,
  serialisationDateSchema
} from "../date";
import { Temporal } from "@js-temporal/polyfill";

const auditEnvelopeSchemaFactory = <T extends ZodObject, U extends RichDate | SerialisationDate>(
  data: T, dateSchema: ZodType<U>
) => z.object({
  data: data.partial(),
  updated: dateSchema.describe('This is the date when this data was last updated.'),
});

const envelopeBaseSchema = z.object({
  created: serialisationDateSchema.describe('This is the date when the data was wrapped.'),
  id: z.string().default(() => crypto.randomUUID()),
  sync: z.number().optional().describe(
    'Last sync time in epochMilliseconds. Undefined means never synced.'
  )
});

const envelopeSchemaExtensionFactory = <T extends z.ZodRawShape>(
  schema: T
) => z.object({
  audit: z.array(z.object({
    data: z.object(schema).partial(),
    updated: serialisationDateSchema.describe('This is the date when this data was last updated.'),
  })).default([]),
  data: z.object(schema),
});
export const envelopeSchemaFactory = <T extends z.ZodRawShape>(
  schema: T
) => z.object({
  ...envelopeBaseSchema.shape,
  // audit: z.array(z.object({
  //   data: z.object(schema).partial(),
  //   updated: serialisationDateSchema.describe('This is the date when this data was last updated.'),
  // })).default([]),
  // data: z.object(schema),
  ...envelopeSchemaExtensionFactory(schema).shape,
});
export type EnvelopeSchema<
  T extends z.ZodRawShape = z.ZodRawShape
> = ReturnType<typeof envelopeSchemaFactory<T>>;
export type Envelope<T extends z.ZodRawShape = z.ZodRawShape> = z.infer<
  EnvelopeSchema<T>
>;
export type EnvelopeFromCore<Core extends object> = z.infer<
  typeof envelopeBaseSchema
> & {
  audit: { data: Partial<Core>; updated: SerialisationDate; }[];
  data: Core;
};
export type EnrichedEnvelopeFromCore<Core extends object> = Omit<
  EnvelopeFromCore<Core>, 'audit' | 'created'
> & {
  audit: { data: Partial<Core>; updated: Temporal.ZonedDateTime; }[];
  created: Temporal.ZonedDateTime;
};

const baseFactory = <T extends ZodObject, U extends RichDate | SerialisationDate>(
  data: T, dateSchema: ZodType<U>
) => z.object({
  audit: z.array(auditEnvelopeSchemaFactory(data, dateSchema)).default([]),
  created: dateSchema.describe('This is the date when the data was wrapped.'),
  data,
  id: z.string().default(() => crypto.randomUUID()),
  sync: z.number().optional().describe(
    'Last sync time in epochMilliseconds. Undefined means never synced.'
  ),
});
export type EnvelopeLegacy<T extends ZodObject, U extends RichDate | SerialisationDate> = z.infer<
  ReturnType<typeof baseFactory<T, U>>
>;

export type EnvelopeSchemaFactoryParams<T extends ZodObject> = {
  data: T;
  options?: {
    // foreign key property names, could provide an enum or just array of strings.
    // summary data has to be a property from the relationship
    relationships?: Record<string, ZodType>;
  };
};

const envelopeSchemaFactoryLegacy = <
  U extends RichDate | SerialisationDate
>(
  dateSchema: ZodType<U>
) => <T extends ZodObject>(
  { data, options }: EnvelopeSchemaFactoryParams<T>
) => {
    const summaryShape = options?.relationships ? Object.fromEntries(
      Object.entries(options.relationships).map(
        ([relatedProperty, value]) => [relatedProperty, value]
      )
    ) : {};
    return baseFactory<T, z.infer<typeof dateSchema>>(data, dateSchema).extend({
      summary: z.object(summaryShape).default({}),
    });
  };

export const envelopeSerialisationSchemaFactory = <T extends ZodObject>(
  params: EnvelopeSchemaFactoryParams<T>
) => envelopeSchemaFactoryLegacy(serialisationDateSchema)(params);
export type SerialisationEnvelopeSchema<T extends ZodObject> = ReturnType<
  typeof envelopeSerialisationSchemaFactory<T>
>;
export type SerialisationEnvelope<T extends ZodObject> = z.infer<
  SerialisationEnvelopeSchema<T>
>;

export const envelopeRichSchemaFactory = <T extends ZodObject>(
  params: EnvelopeSchemaFactoryParams<T>
) => envelopeSchemaFactoryLegacy(richDateSchema)(params);
export type RichEnvelopeSchema<TCoreSchema extends ZodObject> = ReturnType<
  typeof envelopeRichSchemaFactory<TCoreSchema>
>;
export type RichEnvelope<TCoreSchema extends ZodObject> = z.infer<
  RichEnvelopeSchema<TCoreSchema>
>;
