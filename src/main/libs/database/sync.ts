import { DatabaseSyncAction } from "@/shared/database";
import { MetaCollection, SerialisationEnvelope } from "@/shared/schema";
import { SyncableCollection } from "./types";
import { getSyncStatus } from "./meta";
import { optionsDb } from "./options";
import z from "zod";
// import { getSyncStatus } from "./utilities";

type SyncableDoc<T extends SerialisationEnvelope<unknown>> = {
  local: T;
  remote?: T;
} | {
  local?: T;
  remote: T;
};

const getSyncAction = <T extends SerialisationEnvelope<unknown>>(
  doc: SyncableDoc<T>
): DatabaseSyncAction => {
  // If the remote record doesn't exist, backup the record.
  if (!doc.remote?.sync) {
    return 'backup';
  }

  // If the local record doesn't exist, restore the record.
  if (!doc.local?.sync) {
    return 'restore';
  }

  // If the remote sync is less than the local, backup the record.
  if (doc.remote.sync < doc.local.sync) {
    return 'backup';
  }

  // If the local record sync is less than the remote, restore the record.
  if (doc.remote.sync > doc.local.sync) {
    return 'restore';
  }

  // No action is required if syncs are equal.
  return 'none';
}

// const mapSyncableDoc = ()

export const databaseBackup = <T extends SerialisationEnvelope<unknown>>(
  remote: Pick<SyncableCollection<T>, 'remote'>['remote'], doc: T
) => remote.upsert(doc.id, doc);

const syncRecords = async <T extends SerialisationEnvelope<unknown>>(
  metaCollection: MetaCollection,
  { local, remote }: SyncableCollection<T>,
) => {
  const { action } = getSyncStatus(metaCollection);
  if (action === 'check') {
    // Local sync is definitely undefined.
    // Check the local collection for data.
    // If the local data is empty, we can rule out a backup.
    // If not, we can get all the local data and check for sync candidates.
    // Check the remote collection for data.
    // If the remote data is empty, we can rule out a restore.
    // If not, we can get all the remote data and check for sync candidates.

    // May as well kick this off early...
    const remoteDocsPromise = remote.list();
    const localDocs = local.db.getAllData();
    const allDocs = new Map<string, SyncableDoc<T>>();

    localDocs.forEach((local) => allDocs.set(local.id, { local }));


    // Then await it when we really need it.
    const remoteDocs = await remoteDocsPromise;

    remoteDocs.forEach((remote) => {
      const existing = allDocs.get(remote.id);
      allDocs.set(remote.id, { ...existing, remote });
    });

    const reports = await Promise.allSettled([...allDocs.values()].map(
      async (item): Promise<DatabaseSyncAction> => {
        // NOTE: There is the potential for a "sync" action at a more granular
        // level, but we're not doing that.
        const action = getSyncAction(item);
        switch (action) {
          case 'backup':
            if (item.local) {
              // TODO: Should "debounce" these somewhere, but we can kick that
              // down the road.
              // We can keep a record of ids in the meta collection and an
              // action status.
              // Ofc, every time we update the metaCollectionDB because we've
              // performed a write to that collection/id, we should
              // blank the action JIC the remote would have been updated
              // elsewhere.
              // THEN we can review the list of ids and their actions, and
              // update the ones which are blank.
              await databaseBackup(remote, item.local);
            }
            break;
          case 'restore':
            if (item.remote) {
              await local.update(
                { id: item.remote.id }, item.remote, { upsert: true }
              );
            }
            break;
        }

        return action;
      }
    ));

    reports.map(async (stuff) => {
      if (stuff.status === 'fulfilled') {
        stuff.value
      }
    });
  }
  if (action === 'backup') {
    // Run an update into the remote (might not have happened
    // earlier because of internet issues).
    // We can do something similar to the "check", but we only need to run the backups.
    // await backup(remote, item.local);
  }

  // Create wrapper: should run emit.
  // local.insert()
  // Update wrapper: should run emit.
};

// So we have two aspects to this:
// 1. Updating meta to appropriately queue syncs.
// 2. Running the sync.
