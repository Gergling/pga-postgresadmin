import z from "zod";
import {
  envelopeCodecFactory,
  envelopeRichSchemaFactory,
  envelopeSchemaFactory,
  envelopeSerialisationSchemaFactory,
} from "@/shared/schema";
import { LlmEmbeddingCache, LlmEmotionName, llmEmotionPersistenceSchema } from "../llm";

const diaryEntryCoreAnalysisSchema = z.object({
  emotional: llmEmotionPersistenceSchema,
});
export type DiaryEntryCoreAnalysis = z.infer<typeof diaryEntryCoreAnalysisSchema>;

const status = z.enum([
  'draft',
  'committed',
  'processing',
  'processed',
  'rejected',
]).default('draft');

const text = z.string();

export const diaryEntryCoreSchema = z.object({
  analysis: diaryEntryCoreAnalysisSchema.optional(),
  embedding: z.array(z.number()).optional(),
  status, text,
  // At some point this will need an object with all the relevant ids for things
  // like tasks created.
});
export type DiaryEntryCore = z.infer<typeof diaryEntryCoreSchema>;

/**
 * @deprecated Best not use this; use diaryEntryRichSchema or diaryEntrySerialisationSchema depending on your needs.
 */
export const diaryEntrySchema = envelopeSerialisationSchemaFactory({ data: diaryEntryCoreSchema });

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

// envelopeSchemaFactory
