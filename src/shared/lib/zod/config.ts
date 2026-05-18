import z, { ZodType } from "zod";

// TODO: How to handle audit for persistence? Possibly just configure it.
// E.g. options?: { audit?: [/** omitted props */] }
// If the id is an omitted prop, it should warn about it being unnecessary.
// Audit type automatically comes with an "updated" string.
// TODO: Persistence side again, how to handle relationships.
// Summaries are pretty straightforward because you supply the relationship
// name, the collection name and the summary fields such as "name" (id is
// assumed). Otherwise, relationships will need to be taken care of nearer the
// database level. Probably in main or something.
// TODO: Handle created string conversion to Temporal when necessary.
export const envelopeSchemaFactory = <T>(content: ZodType<T>) => z.object({
  // This is so that we can create a record in the renderer and the response has
  // the same id.
  responseId: z.uuid().default(crypto.randomUUID()),
  id: z.uuid().optional(),
  content,
  created: z.string().default(Date.now().toLocaleString()),
});

// const storageEnvelopeAuditSchemaFactory = <T>(
//   data: ZodType<T>,
// ) => z.array(data.)

// Storage and transfer work differently:
// Storage might not have an id beforehand (if creating) but will once created.
// Transfer id is always optional, but consistent before and after storage.
// Transfer id does not need storage.
// So we have a transfer envelope which contains a storage envelope.

export type Envelope<T> = z.infer<ReturnType<typeof envelopeSchemaFactory<T>>>;

// Standard crud creation function:
// Takes an envelope input but the type varies
// Returns an envelope output, but the type varies
// Putting into Firebase is a type with no id.
// What if everything just goes in wrapped in an envelope, and the id can be
// optional from the transfer side


