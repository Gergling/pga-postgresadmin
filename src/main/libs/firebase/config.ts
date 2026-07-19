import firebaseAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { FirestoreRepository, ID } from '@spacelabstech/firestoreorm';
import { ZodObject } from 'zod';
import { SerialisationEnvelope } from '@/shared/schema';
import {
  loadAppSettings,
  loadElectronSettings,
  log,
  LogApi
} from '@/main/shared';

dotenv.config();

const firebaseServiceAccountPathDev = process.env.FIREBASE_SERVICE_ACCOUNT_PATH_DEV;

export const isFirebaseDevEnabled = !!firebaseServiceAccountPathDev;

const getEnvironmentName = async () => {
  const environmentName = (await loadElectronSettings('env')) ?? 'dev';
  return environmentName;
};

const getFirebaseServiceAccountProductionCredential = async (
  { log }: LogApi
): Promise<firebaseAdmin.credential.Credential | undefined> => log(
  'Fetching Firebase production credentials...',
  async ({ log }) => {
    const settings = await log('Loading app settings', loadAppSettings);
    if (!settings.firebase?.production) return;
    const account = JSON.parse(settings.firebase.production);
    return firebaseAdmin.credential.cert(account);
  }
);

const fetchCredentials = async ({ log }: LogApi): Promise<firebaseAdmin.credential.Credential | undefined> => log(
  'Fetching Firebase credentials...',
  async (props) => {
    const { setMessage, setStatus, log } = props;
    if (!firebaseServiceAccountPathDev) {
      setStatus('warning');
      setMessage('No dev path defined. Assuming production environment.');
      const result = await getFirebaseServiceAccountProductionCredential(props);
      if (!result) setMessage('No production credentials available.');
      return result;
    }

    const environmentName = await getEnvironmentName();
    if (environmentName === 'prod') {
      setStatus('warning');
      setMessage('Using production credentials.');
      const result = await getFirebaseServiceAccountProductionCredential(props);
      if (!result) setMessage('No production credentials available.');
      return result;
    }

    setMessage('Using dev Firebase credentials.');

    return firebaseAdmin.credential.cert(firebaseServiceAccountPathDev);
  }
);

const state: {
  db: firebaseAdmin.firestore.Firestore | null;
  inProgress: boolean;
  pendingInit: Promise<firebaseAdmin.firestore.Firestore> | null;
} = {
  db: null,
  inProgress: false,
  pendingInit: null,
};

export const initializeFirebase = async (props: LogApi) => {
  // const parentOp = getOperation(props.operation.parent);
  // console.log('initialise firebase parent op', parentOp);
  state.pendingInit = (async () => {
    state.inProgress = true;

    if (firebaseAdmin.apps.length > 0) {
      await props.log(
        'Cleaning up existing Firebase instance.',
        () => firebaseAdmin.app().delete()
      );
    }

    const credential = await fetchCredentials(props);

    const app = firebaseAdmin.initializeApp({ credential });
    state.db = firebaseAdmin.firestore(app);
    state.inProgress = false;
    state.pendingInit = null;
    return state.db;
  })();
  return state.pendingInit;
};

log('Initialise Firestore', initializeFirebase)

export const getFirebaseDb = (suppressInitialisation?: boolean) => {
  if (!state.db) {
    if (!suppressInitialisation) {
      if (state.inProgress) {
        log('Firebase is already initialising.');
      } else {
        // Deliberately not awaited, with the intention that it runs in the
        // background.
        log(
          'Database not yet instantiated. Initialising Firebase.',
          initializeFirebase
        );
      }
    }
    return new Proxy({} as firebaseAdmin.firestore.Firestore, {
      get(_, prop) {
        if (!state.db) {
          throw new Error("Firestore accessed before credentials were loaded.");
        }
        return Reflect.get(state.db, prop);
      }
    });
    // return firebaseAdmin.firestore();
  }
  return state.db;
}

// A generic helper to make any repo "lazy"
export function createProcrastinatedRepo<T extends { id?: ID; }>(
  collectionName: string,
  schema: ZodObject
) {
  let _instance: FirestoreRepository<T> | null = null;

  return new Proxy({} as FirestoreRepository<T>, {
    get(_, prop, receiver) {
      if (!state.db) {
        throw new Error(`Cannot access ${collectionName} repo: Database not initialized. Check Settings.`);
      }

      // Create the real repo singleton only on first access
      if (!_instance) {
        _instance = FirestoreRepository.withSchema<T>(
          state.db, collectionName, schema
        );
      }

      const value = Reflect.get(_instance, prop, receiver);

      // If it's a function, we must bind it to the real instance
      // so it doesn't lose its "this" context
      return typeof value === 'function' ? value.bind(_instance) : value;
    }
  });
}

export const createAsynchronousRepo = <
  T extends SerialisationEnvelope<unknown>
>(
  collectionName: string, schema: ZodObject
): Promise<FirestoreRepository<T>> => {
  let attempts = 0;

  const timeout = 300;
  const create = (
    db: firebaseAdmin.firestore.Firestore
  ) => FirestoreRepository.withSchema<T>(db, collectionName, schema);

  return log(`Setting up firestore repo: ${collectionName}`, () => {
    return new Promise((innerResolve, innerReject) => {
      const runTimeout = () => {
        if (state.db) {
          innerResolve(create(state.db));
          return;
        }

        if (attempts >= 5) {
          innerReject(new Error('Database not initialized after 5 attempts.'));
          return;
        }

        attempts += 1;
        setTimeout(runTimeout, timeout);
      }

      runTimeout();
    });

  });
  // return new Promise<FirestoreRepository<T>>(async () => {
  //   const result = await log(`Setting up firestore repo: ${collectionName}`, () => {
  //     return new Promise((innerResolve, innerReject) => {
  //       const runTimeout = () => {
  //         if (state.db) {
  //           innerResolve(create(state.db));
  //           return;
  //         }

  //         if (attempts >= 5) {
  //           innerReject(new Error('Database not initialized after 5 attempts.'));
  //           return;
  //         }

  //         attempts += 1;
  //         setTimeout(runTimeout, timeout);
  //       }

  //       runTimeout();
  //     });

  //   });

  //   return result;
  // });
};
