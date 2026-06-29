import Datastore from '@seald-io/nedb';
import { EventEmitter } from 'events';
import z, { ZodObject, ZodType } from "zod";
import task from 'tasuku';
import { Temporal } from '@js-temporal/polyfill';
import {
  dateSerialisationCodec,
  Envelope,
  SerialisationDate,
  SerialisationEnvelope
} from '@/shared/schema';
import { createAsynchronousRepo, createProcrastinatedRepo } from "../firebase";
import { setupLocalNeDb } from '../nedb';
import { databaseEventFactory } from './eventFactory';
import { shouldSync } from './utilities';
import { metaCollectionRegister } from './meta';
import { now } from '@/shared/utilities';
import { databaseBackup } from './sync';

const register = metaCollectionRegister();

const syncEvents = ['afterCreate', 'afterUpdate'] as const;

export const setupCollection = <T extends SerialisationEnvelope<unknown>>(
  collectionName: string,
  schema: ZodObject, // More specifically, this should infer back to T.
) => {
  const meta = register.factory(collectionName);
  const local = setupLocalNeDb<T>(collectionName);
  // TODO: Sync actions might be worth multi-threading to avoid unexpected
  // delays if the hard drive is being fucky.
  // IF WE ARE DOING THAT we will want to avoid race conditions by only updating
  // the sync times when they are higher than the previously recorded sync times.
  // This is to avoid data loss through unexpected backups or restores (the
  // latter being more of a hazard, potentially).
  const remote = createAsynchronousRepo<T>(collectionName, schema).then(
    (repo) => {
      // Emit function for the local write.
      const { emit } = databaseEventFactory<T>(
        collectionName, async (envelope: T) => {
          const runSync = shouldSync(envelope);
          if (runSync) {
            const sync = now().epochMilliseconds;
            // This is technically a "backup" action.
            // This should probably queue properly.
            // For that matter, if we're storing the collection/id sync data,
            // we don't really need to run the sync here, just queue it up.
            // Could make use of subcollections if we're updating the meta
            // collection at the id level.

            // await databaseBackup(repo, {
            //   ...envelope, sync
            // });

            // await repo.upsert(envelope.id, {
            //   ...envelope, sync
            // });

            // Register local write with meta.
            await meta.local(sync);
          }

          console.log(collectionName, envelope);
        }
      );

      register.setSyncableCollection({
        emit, local, name: collectionName, remote: repo
      });
      return { emit, repo };
    }
  );

  return {
    local, remote,
    // repo
  };
};


// Before update: audit should have data prepended.
// After update: run emitter.emit(`update:${collectionName}`).
