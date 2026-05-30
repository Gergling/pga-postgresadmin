import z, { ZodType } from "zod";
import { temporalSchema } from "@/shared/lib/temporal";
import { auditEnvelopeSchemaFactory, envelopeSchemaFactory } from "./base";

export const uiEnvelopeSchemaFactory = <T>(
  schema: ZodType<T>
) => envelopeSchemaFactory(schema).extend({
  audit: z.array(
    auditEnvelopeSchemaFactory(schema).extend({ updated: temporalSchema })
  ),
  created: temporalSchema,
});

export type UiEnvelope<T> = z.infer<
  ReturnType<typeof uiEnvelopeSchemaFactory<T>>
>;
