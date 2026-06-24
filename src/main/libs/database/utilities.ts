import { dateSerialisationCodec, SerialisationEnvelope } from "@/shared/schema";

/**
 * Determines if the envelope needs to be synced.
 * @param envelope The envelope to check.
 * @param sync The current sync time in epoch milliseconds.
 * @returns True if the envelope needs to be synced, false otherwise.
 */
export const shouldSync = <T>({
  audit: [latest], sync
}: SerialisationEnvelope<T>): boolean => {
  // If there is no latest audit, the record is new.
  // If there is no sync value, the record has never been synced.
  if (!latest || !sync) return true;

  // Here is the last written time for the data in epoch milliseconds.
  console.log('latest.updated', latest.updated);
  const lastWritten = dateSerialisationCodec.decode(
    latest.updated
  ).epochMilliseconds;

  // If the sync was before the last write, then the local data is stale.
  if (sync < lastWritten) return true;

  // Otherwise, the sync was done after or during this write, so no sync is required.
  return false;
};