import z, { ZodType } from "zod";
import { dateSchema } from "./common";

export const transferEnvelopeSchemaFactory = <T>(
  payload: ZodType<T>
) => z.object({
  created: dateSchema, id: z.uuid().default(crypto.randomUUID()), payload,
});
