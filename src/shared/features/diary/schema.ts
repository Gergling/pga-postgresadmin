import z from "zod";
import {
  persistentEnvelopeSchemaFactory,
  transferEnvelopeSchemaFactory
} from "@/shared/schema";

const status = z.enum([
  'draft',
  'committed',
  'processing',
  'processed',
  'rejected',
]).default('draft');

const text = z.string();

export const diaryEntrySchema = z.object({
  status, text,
  // At some point this will need an object with all the relevant ids for things
  // like tasks created.
});

// The DB content.
export const diaryEntryPersistentSchema
  = persistentEnvelopeSchemaFactory(diaryEntrySchema);
export type DiaryEntryPersistent = z.infer<typeof diaryEntryPersistentSchema>;

// The transfer response.
export const diaryEntryTransferSchema
  = transferEnvelopeSchemaFactory(diaryEntryPersistentSchema);
export type DiaryEntryTransfer = z.infer<typeof diaryEntryTransferSchema>;
