import z from "zod";
import {
  envelopeSchemaFactory,
  ipcCodecFactory,
  transferEnvelopeSchemaFactory,
  uiEnvelopeSchemaFactory
} from "@/shared/schema";

const status = z.enum([
  'draft',
  'committed',
  'processing',
  'processed',
  'rejected',
]).default('draft');

const text = z.string();

export const diaryEntryCoreSchema = z.object({
  status, text,
  // At some point this will need an object with all the relevant ids for things
  // like tasks created.
});

export const diaryEntrySchema = envelopeSchemaFactory(diaryEntryCoreSchema);
export type DiaryEntry = z.infer<typeof diaryEntrySchema>;

// The transfer response.
export const diaryEntryTransferSchema
  = transferEnvelopeSchemaFactory(diaryEntryCoreSchema);
export type DiaryEntryTransfer = z.infer<typeof diaryEntryTransferSchema>;

// The UI schema
export const diaryEntryUiSchema
  = uiEnvelopeSchemaFactory(diaryEntryCoreSchema);
export type DiaryEntryUi = z.infer<typeof diaryEntryUiSchema>;

export const diaryIpcCodec = ipcCodecFactory(
  diaryEntryTransferSchema, diaryEntryUiSchema
);
