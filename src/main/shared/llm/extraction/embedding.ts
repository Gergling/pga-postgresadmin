// Some embeddings are "hard-coded".

import { LlmEmbeddingCache } from "@/shared/features/llm";
import { LogApi } from "../../logging";
import {
  listEmbeddingCache,
  readEmbeddingCache,
  removeEmbeddingCache
} from "../crud";
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

const invalidateCache = debounce(({ log }: LogApi) => {
  if (registry.requested.length > 0) return;
  return log(
    `Embedding registry: Invalidating cache.`,
    async ({ log, setStatus }) => {
      const existing = await log(
        'Retrieving existing cache', listEmbeddingCache
      );
      // If the registry of embeddings doesn't contain
      const stale = existing.filter(({ phrase }) => {
        // If it's already been embedded, then we know it is not stale.
        if (registry.embedded.get(phrase)) return false;
        // If we're waiting for it to be embedded, then we know it is not stale.
        if (registry.awaiting.get(phrase)) return false;
        // If it has been requested, then it is not stale.
        if (registry.requested.includes(phrase)) return false;
        // Otherwise, by this point, it simply isn't in a configuration
        // somewhere.
        return true;
      });
      if (stale.length === 0) return setStatus(
        'information', 'No stale phrases were found.'
      );
      return log(
        `Removing ${stale.length} stale phrases from cache`,
        () => Promise.all(
          stale.map(({ phrase }) => removeEmbeddingCache(phrase))
        )
      );
    }
  );
}, 1000);

const readEmbedding = (phrase: string, { log }: LogApi) => log(
  `Embedding registry: Registering phrase: ${phrase}`,
  async (logApi) => {
    const awaiting = readEmbeddingCache(phrase, logApi);
    registry.awaiting.set(phrase, awaiting);
    return awaiting.then((response) => {
      registry.embedded.set(response.phrase, response);
      registry.awaiting.delete(phrase);
      registry.requested = registry.requested.filter(
        (requestedPhrase) => requestedPhrase !== phrase
      );
      invalidateCache(logApi);
      return response;
    });
  }
);

// Exposed functions.
export const registerEmbeddingPhrase = (phrase: string, logApi: LogApi) => {
  // If it's been loaded up, we can pretty much use it immediately.
  const existingEmbedded = registry.embedded.get(phrase);
  if (existingEmbedded) return existingEmbedded;

  // If it's still loading from cache or being computed, we return the promise
  // we're waiting on.
  const existingAwaiting = registry.awaiting.get(phrase);
  if (existingAwaiting) return existingAwaiting;

  // Otherwise, we put in a request for the phrase to be loaded up.
  registry.requested.push(phrase);

  // Since we're here, we may as well kick off the request.
  return readEmbedding(phrase, logApi);
};
