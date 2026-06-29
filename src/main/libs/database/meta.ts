import { DatabaseSyncAction } from "@/shared/database";
import { MetaCollection, SerialisationEnvelope } from "@/shared/schema";
import { setupBasicNeDb } from "../nedb";
import { SyncableCollection } from "./types";

const setupMetaCollection = () => setupBasicNeDb<MetaCollection>('meta');

export type MetaCollectionDatabase = ReturnType<typeof setupMetaCollection>;

const upsert = (
  db: MetaCollectionDatabase, name: string, data: Omit<MetaCollection, 'name'>
) => new Promise(async (resolve, reject) => db.db.update(
  { name }, data, { upsert: true },
  (err, numberOfUpdated, affectedDocuments, upserted) => {
    const response = { err, numberOfUpdated, affectedDocuments, upserted };
    if (err) {
      reject(response);
      return;
    }
    resolve(response);
  }
));

type DatabaseSyncStatus = MetaCollection & {
  action: DatabaseSyncAction;
};

export const getSyncStatus = (data: MetaCollection): DatabaseSyncStatus => {
  const { local, sync } = data;

  // If we have local populated, we know there is local data.
  if (local !== undefined) {
    // If we have sync populated, we need to compare them.
    // If the local is higher than the sync or there is no sync, we need to run
    // a backup.
    if (sync === undefined || local > sync) return { ...data, action: 'backup' };

    // Otherwise, we're up to date.
    return { ...data, action: 'none' };
  }

  // At this point, local is definitely undefined.
  // Sync *should* be undefined, but may not be.
  // One way or another, run a check.
  return { ...data, action: 'check' };
};

const getDatabaseSyncStatus = (
  db: MetaCollectionDatabase
) => db.db.getAllData().map((data) => getSyncStatus(data));

const metaCollectionDb = setupMetaCollection();

export const metaCollectionRegister = () => {
  const syncableCollections: SyncableCollection[] = [];

  const factory = (collectionName: string) => {
    const local = (local: number) => upsert(
      metaCollectionDb, collectionName, { local }
    );
    const remote = (sync: number | undefined) => upsert(
      metaCollectionDb, collectionName, { sync }
    );

    return { local, remote };
  };

  const status = () => getDatabaseSyncStatus(metaCollectionDb);

  const setSyncableCollection = <
    T extends SerialisationEnvelope<unknown>
  >(syncableCollection: SyncableCollection<T>) => {
    const { emit, local, name, remote } = syncableCollection;
    syncableCollections.push(syncableCollection);
    metaCollectionDb.findOne({ name }).then((data) => {
      // If there's no data, what do we do?
      // We could just create it ofc...
      if (!data) return;
      const { action } = getSyncStatus(data);
      if (action === 'check') {
        // Local sync is definitely undefined.
        // Check the local collection for data.
        // If the local data is empty, we can rule out a backup.
        // If not, we can get all the local data and check for sync candidates.
        // Check the remote collection for data.
        // If the remote data is empty, we can rule out a restore.
        // If not, we can get all the remote data and check for sync candidates.
        const localDocs = local.db.getAllData();
        const remoteDocs = remote.list();

        // If the remote record doesn't exist or the sync is less than the local, backup the record.
        // remote.upsert()
        // If the local record doesn't exist or the sync is less than the remote, restore the record.
      }
      if (action === 'backup') {
        // Run an update into the remote (might not have happened
        // earlier because of internet issues).
      }
    });

    // Create wrapper: should run emit.
    // local.insert()
    // Update wrapper: should run emit.
  };

  // Could return a db by name here, and it could be an instance allowing for
  // the emit run.
  // Would addWriteListener to named db wrapper when running
  // setSyncableCollection.

  return {
    factory,
    status,
    setSyncableCollection,
  }
};
