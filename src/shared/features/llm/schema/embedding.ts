// Some embeddings are "hard-coded".

import z from "zod";

// So we look them up by phrase. The phrase matches to the embedding.
// We attempt to read an embedding from the database.
// We fail to find it at first.
// We extract it.
// We upsert it.
// We return the embedding whether we read it or extracted it.
// TBH when we first set them up, we can make sure they get written by
// performing the "read".

// We invalidate the cache by loading up everything that exists and checking for
// everything that should have been added to the config by now.
// Adding to the config should absolutely be a synchronous operation. Reading
// it should be asynchronous.
// We need to trigger the removal of embeddings which aren't being added to the
// config anymore.

export const llmEmbeddingCacheSchema = z.object({
  phrase: z.string(),
  embedding: z.array(z.number()),
});
export type LlmEmbeddingCache = z.infer<typeof llmEmbeddingCacheSchema>;
