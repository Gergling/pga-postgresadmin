import z from "zod";
import { LlmEmbeddingCache } from "./embedding";

export const llmEmotionNameSchema = z.enum(
  ["anxiety", "sadness", "anger", "joy", "apathy", "guilt", "hope"]
);
export type LlmEmotionName = z.infer<typeof llmEmotionNameSchema>;

export type EmotionEmbeddings = LlmEmbeddingCache & {
  emotion: LlmEmotionName;
};

export const llmEmotionPersistenceSchema = z.record(
  llmEmotionNameSchema,
  z.number()
);
