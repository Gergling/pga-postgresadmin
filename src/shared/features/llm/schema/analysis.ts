import { getObjectEntries, getObjectFromEntries } from "@/shared/utilities";
import z from "zod";

const llmEmotionNameSchema = z.enum(
  ["anxiety", "sadness", "anger", "joy", "apathy", "guilt"]
);

const llmEmotionPhrasesSchema = z.array(z.string()).describe(
  "Exact word-for-word substrings from the text that explicitly signal this emotion. Leave empty if none exist."
);

export const llmEmotionPersistenceSchema = z.record(
  llmEmotionNameSchema,
  llmEmotionPhrasesSchema
);
export const llmEmotionAnalysisSchema = z.array(z.object({
  emotion: llmEmotionNameSchema,
  phrases: llmEmotionPhrasesSchema,
}));

export const llmEmotionCodec = z.codec(
  llmEmotionPersistenceSchema,
  llmEmotionAnalysisSchema,
  {
    decode: (encoded) => getObjectEntries(encoded).map(
      ([emotion, phrases]) => ({ emotion, phrases })
    ),
    encode: (decoded) => getObjectFromEntries(decoded.map(
      ({ emotion, phrases }) => [emotion, phrases]
    )),
  }
);


// Probably needs a chunk of this in "libs" or something, but the shared code
// will be handling any logic.
// The main thread(s) will deal with things like diary text analysis.
// import { pipeline, cosineSimilarity } from '@xenova/transformers';

// // 1. Initialize a tiny, fast embedding model (runs locally, ~100MB)
// const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

// // 2. Define your static "anchor" concepts
// const anxietyAnchor = await extractor('I feel overwhelmed, stressed, and anxious about deadlines', { pooling: 'mean', normalize: true });
// const joyAnchor = await extractor('I am happy, productive, excited, and full of energy', { pooling: 'mean', normalize: true });

// async function analyzeDiaryEntry(rawDiaryText: string) {
//   // 3. Turn your raw, un-extracted diary entry into a coordinate vector
//   const entryEmbedding = await extractor(rawDiaryText, { pooling: 'mean', normalize: true });

//   // 4. Calculate the geometric angle (Cosine Similarity)
//   // Returns a score between -1 and 1 (closer to 1 means geometrically identical)
//   const anxietyScore = cosineSimilarity(entryEmbedding.data, anxietyAnchor.data);
//   const joyScore = cosineSimilarity(entryEmbedding.data, joyAnchor.data);

//   return {
//     rawText: rawDiaryText,
//     metrics: {
//       anxiety: Math.max(0, anxietyScore), // Simple normalization
//       joy: Math.max(0, joyScore)
//     }
//   };
// }

// // Example usage on raw linguistic nonsense:
// const log = await analyzeDiaryEntry("ugh too much stuff to do, code is breaking, head hurts");
// console.log(log.metrics); // Will geometrically lean heavily toward anxiety, zero LLM required.

