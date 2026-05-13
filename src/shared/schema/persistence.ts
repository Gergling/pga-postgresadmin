import z, { ZodObject, ZodType } from "zod";
import { dateSchema } from "./common";

const auditEnvelopeSchemaFactory = <T>(data: ZodType<T>) => z.object({
  data, updated: dateSchema,
});

const conditionalExtension = <T extends object>(
  condition: boolean, obj: T
) => condition ? obj : {};

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
