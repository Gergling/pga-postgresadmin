import z from "zod";
import { serialisationDateNow, serialisationDateSchema } from "../date";
import { envelopeBaseSchema } from "../envelope";

const metaDtoSchemaBaseShape = {
  created: serialisationDateSchema.describe('This is the date when the data was wrapped.'),
  id: z.string().default(() => crypto.randomUUID()),
  sync: z.number().optional().describe(
    'Last sync time in epochMilliseconds. Undefined means never synced.'
  )
};
export const metaDtoSchema = z.object(metaDtoSchemaBaseShape);
export type DtoMeta = z.infer<typeof metaDtoSchema>;
export const metaCreateDtoSchema = z.object({
  ...metaDtoSchemaBaseShape,
  created: metaDtoSchemaBaseShape.created.default(serialisationDateNow),
});

export const transformEnvelopeToMeta = (value: unknown): DtoMeta => {
  const response = envelopeBaseSchema.safeParse(value, { reportInput: true });
  if (response.success) return metaDtoSchema.parse(
    response.data, { reportInput: true }
  );
  return metaCreateDtoSchema.parse(value);
};
