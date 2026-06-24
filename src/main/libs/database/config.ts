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

const syncEvents = ['afterCreate', 'afterUpdate'] as const;

console.log('asshole')
export const setupCollection = <T extends SerialisationEnvelope<unknown>>(
  collectionName: string,
  schema: ZodObject, // More specifically, this should infer back to T.
) => {
  const local = setupLocalNeDb<T>(collectionName);
  const remote = createAsynchronousRepo<T>(collectionName, schema).then(
    (repo) => {
      const { emit } = databaseEventFactory<T>(
        collectionName, (envelope: T) => {
          const runSync = shouldSync(envelope);
          if (runSync) {
            repo.upsert(envelope.id, {
              ...envelope, sync: Temporal.Now.instant().epochMilliseconds
            });
          }

          // Will need to figure out how to upsert. An undefined sync means a creation (I'm pretty sure an upsert is available though).
          // Later: If the firebase sync is greater than the local sync, a write to
          // local DB is required based on the firebase data.
          console.log(collectionName, envelope);
        }
      );
      syncEvents.forEach((event) => {
        repo.on(event, ({ id, sync }) => {
          local.update({ id }, { sync });
        });
      });
      return { emit, repo };
    }
  );

  // This is for a local write to update the Firebase repo.

  // When the firestore DB updates, the local DB is given the updated sync time.

  return {
    local, remote,
    // repo
  };
};


// Before update: audit should have data prepended.
// After update: run emitter.emit(`update:${collectionName}`).
