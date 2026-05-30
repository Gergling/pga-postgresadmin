import z, { ZodType } from "zod";
import { envelopeSchemaFactory } from "./base";

export function transferEnvelopeSchemaFactory<T>(data: ZodType<T>) {
  return envelopeSchemaFactory(data).extend({
    creationKey: z.uuid().default(() => crypto.randomUUID())
      .describe('For creating a draft and being able to find it easily once its come back.'),
  });
}

export type TransferEnvelope<T> = z.infer<
  ReturnType<typeof transferEnvelopeSchemaFactory<T>>
>;
