// Some embeddings are "hard-coded".

import { setupBasicNeDb } from "@/main/libs/nedb";
import { LlmEmbeddingCache, llmEmbeddingCacheSchema } from "@/shared/features/llm";
import { extractEmbedding } from "@/shared/lib/huggingface";
import z from "zod";
import { LogApi } from "../../logging";

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

const embeddingCache = setupBasicNeDb<LlmEmbeddingCache>('llm-embedding-cache');
embeddingCache.db.setAutocompactionInterval(1000 * 60 * 60 * 12);

const safeParseFactory = <T extends z.ZodObject>(
  schema: T
) => (data: unknown): z.infer<T> | undefined => {
  const response = schema.safeParse(data);
  if (response.success) return response.data;
};
const safeParse = safeParseFactory(llmEmbeddingCacheSchema);

const upsertEmbeddingCache = (
  cache: LlmEmbeddingCache
) => embeddingCache.db.updateAsync({
  phrase: cache.phrase
}, cache, { upsert: true });

const logPhrase = (phrase: string) => [
  phrase.slice(0, 15),
  phrase.length > 15 ? '...' : ''
].join('');

export const readEmbeddingCache = (
  phrase: string, { log }: LogApi
): Promise<LlmEmbeddingCache> => log(
  `Reading embedding for phrase "${logPhrase(phrase)}"`,
  async ({ log }) => {
    const cache = await log(
      `Finding cache`,
      () => embeddingCache.db.findOneAsync({ phrase })
    );
    if (cache) {
      const response = safeParse(cache);
      if (response) return response;
    }
    const embedding = await log(
      `No cache. Extracting`,
      () => extractEmbedding(phrase)
    );
    const updatedCache: LlmEmbeddingCache = { phrase, embedding: embedding.data };
    await log(`Upserting cache`, () => upsertEmbeddingCache(updatedCache));
    return updatedCache;
  }
);

export const listEmbeddingCache = async () => {
  const embeddings = await embeddingCache.db.findAsync({});
  return embeddings.reduce((acc, doc) => {
    const response = safeParse(doc);
    if (!response) return acc;
    return [...acc, response];
  }, []);
}

export const removeEmbeddingCache = (
  phrase: string
) => embeddingCache.db.removeAsync({ phrase }, {});
