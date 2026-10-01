// Some embeddings are "hard-coded".

import { LlmEmbeddingCache } from "@/shared/features/llm";
import { log, LogApi } from "../../logging";
import { listEmbeddingCache, readEmbeddingCache, removeEmbeddingCache } from "../crud";
import { debounce } from "@/shared/utilities";

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

const registry: {
  awaiting: Map<string, Promise<LlmEmbeddingCache>>;
  embedded: Map<string, LlmEmbeddingCache>;
  requested: string[];
} = {
  awaiting: new Map(),
  embedded: new Map(),
  requested: [],
};

const invalidateCache = debounce(async () => {
  if (registry.requested.length > 0) return;
  await log(
    `Embedding registry: Invalidating cache.`
  );
  const existing = await listEmbeddingCache();
  const stale = existing.filter(({ phrase }) => registry.embedded.get(
    phrase
  ));
  await Promise.all(stale.map(({ phrase }) => removeEmbeddingCache(phrase)));
}, 1000);

const readEmbedding = (phrase: string) => log(
  `Embedding registry: Registering phrase: ${phrase}`,
  async (logApi) => {
    const awaiting = readEmbeddingCache(phrase, logApi);
    registry.awaiting.set(phrase, awaiting);
    const embedding = await awaiting;
    registry.embedded.set(embedding.phrase, embedding);
    registry.awaiting.delete(phrase);
    registry.requested = registry.requested.filter(
      (requestedPhrase) => requestedPhrase !== phrase
    );
    invalidateCache();
    return embedding;
  }
);

// Exposed functions.
export const registerEmbeddingPhrase = (phrase: string) => {
  const existingEmbedded = registry.embedded.get(phrase);
  if (existingEmbedded) return existingEmbedded;

  const existingAwaiting = registry.awaiting.get(phrase);
  if (existingAwaiting) return existingAwaiting;

  registry.requested.push(phrase);

  return readEmbedding(phrase);
};
