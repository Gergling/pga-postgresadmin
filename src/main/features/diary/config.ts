import {
  EmotionEmbeddings,
  llmEmotionNameSchema,
} from "@/shared/features/llm";
import { registerEmbeddingPhrase } from "@/main/shared";

export const llmEmotionConfigAwaiting = Promise.all(
  llmEmotionNameSchema.options.map(
    async (emotion): Promise<EmotionEmbeddings> => {
      const cache = await registerEmbeddingPhrase(
        `Expressing the emotion of ${emotion}.`
      );
      return {
        ...cache,
        emotion,
      };
    }
  )
);
