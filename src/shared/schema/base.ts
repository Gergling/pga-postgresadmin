import z, { ZodObject, ZodType } from "zod";
import { dateSchema } from "./common";

export const auditEnvelopeSchemaFactory = <T>(data: ZodType<T>) => z.object({
  data, updated: dateSchema,
});

const conditionalExtension = <T extends object>(
  condition: boolean | undefined, obj: T
): (T | object) => condition ? obj : {};

/**
 * 
 * @deprecated Use envelopeSchemaFactory, transferEnvelopeSchemaFactory and
 * uiEnvelopeSchemaFactory.
 * @param data 
 * @param options 
 * @returns 
 */
export function persistentEnvelopeSchemaFactory<T>(
  data: ZodType<T>,
  options?: {
    audit?: boolean;
    summary?: z.ZodObject<Record<string, ZodObject>>;
  },
) {
  return z.object({
    ...conditionalExtension(
      !!options?.audit, { audit: z.array(auditEnvelopeSchemaFactory(data)) }
    ),
    ...conditionalExtension(
      !!options?.summary, { summary: options?.summary }
    ),
    data, created: dateSchema,
    id: z.uuid().default(() => crypto.randomUUID()),
  });
}

const baseEnvelopeSchema = z.object({
  // audit: z.array(auditEnvelopeSchemaFactory(data)),
  created: dateSchema.describe('This is the date when the data was wrapped.'),
  // creationKey: z.uuid().default(() => crypto.randomUUID())
  //   .describe('For creating a draft and being able to find it easily once its come back.'),
  // data,
  id: z.string().default(''),
  // summary: (options?.summary ?? z.object({})),
});

// const transferEnvelopeSchemaFactory = <T>(
//   payload: ZodType<T>
// ) => z.object({
//   ...baseEnvelopeSchema
// });
// Cases:
// Creating a draft in the renderer requires a 
// Extracting a record from the database
// export function envelopeSchemaFactory<T>(data: ZodType<T>,
//   options?: {
//     audit?: boolean;
//     creationKey?: boolean;
//     id?: string;
//   },
// ): ZodObject<z.infer<z.ZodType<T>>>;
// export function envelopeSchemaFactory<T, U extends ZodObject>(
export const envelopeSchemaFactory = <T>(
  data: ZodType<T>
) => baseEnvelopeSchema.extend({
  audit: z.array(auditEnvelopeSchemaFactory(data)).default([]),
  data,
});

export type Envelope<T> = z.infer<
  ReturnType<typeof envelopeSchemaFactory<T>>
>;
