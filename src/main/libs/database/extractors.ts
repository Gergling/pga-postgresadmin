import { FirestoreRepository, ID } from "@spacelabstech/firestoreorm";

export const checkRemoteSyncStatus = async <T extends { id: ID }>(
  repo: FirestoreRepository<T>
): Promise<void> => {
  // Get the latest entry from the repo collection.
  // Run the sync.
};

// 1. Implement meta collection. Is upserted by collection name on each register.
