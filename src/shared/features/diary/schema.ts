import z from "zod";
import {
  envelopeCodecFactory,
  envelopeRichSchemaFactory,
  envelopeSerialisationSchemaFactory,
  richDateSchema,
  serialisationDateSchema,
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

/**
 * @deprecated Best not use this; use diaryEntryRichSchema or diaryEntrySerialisationSchema depending on your needs.
 */
export const diaryEntrySchema = envelopeSerialisationSchemaFactory({ data: diaryEntryCoreSchema });
/**
 * @deprecated Best not use this; use DiaryEntryRich or DiaryEntrySerialisation depending on your needs.
 */
export type DiaryEntry = z.infer<typeof diaryEntrySchema>;

// The serialisation response.
export const diaryEntrySerialisationSchema = envelopeSerialisationSchemaFactory({
  data: diaryEntryCoreSchema,
});
export type DiaryEntrySerialisation = z.infer<
  typeof diaryEntrySerialisationSchema
>;

export const diaryEntryRichSchema
  = envelopeRichSchemaFactory({ data: diaryEntryCoreSchema });
export type DiaryEntryRich = z.infer<typeof diaryEntryRichSchema>;

/**
 * @deprecated Best not use this; use diaryEntryRich.
 */
export const diaryEntryUiSchema
  = envelopeRichSchemaFactory({ data: diaryEntryCoreSchema });
/**
 * @deprecated Best not use this; use DiaryEntryRich.
 */
export type DiaryEntryUi = z.infer<typeof diaryEntryUiSchema>;

export const diaryIpcCodec = envelopeCodecFactory(
  diaryEntrySerialisationSchema, diaryEntryRichSchema
);
