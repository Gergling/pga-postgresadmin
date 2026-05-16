import firebaseAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';
import task, { Task, TaskAPI } from 'tasuku';
import { FirestoreRepository, ID } from '@spacelabstech/firestoreorm';
import { ZodObject } from 'zod';
import {
  loadAppSettings,
  loadElectronSettings,
  log
} from '@/main/shared';

dotenv.config();

const firebaseServiceAccountPathDev = process.env.FIREBASE_SERVICE_ACCOUNT_PATH_DEV;

export const isFirebaseDevEnabled = !!firebaseServiceAccountPathDev;

const getEnvironmentName = async () => {
  const environmentName = (await loadElectronSettings('env')) ?? 'dev';
  return environmentName;
};

const getFirebaseServiceAccountProductionCredential = async (task: Task): Promise<
  TaskAPI<firebaseAdmin.credential.Credential | undefined>
> => task(
  'Fetching Firebase production credentials...',
  async () => {
    const settings = await loadAppSettings();
    if (!settings.firebase?.production) return;
    const account = JSON.parse(settings.firebase.production);
    return firebaseAdmin.credential.cert(account);
  }
);

const fetchCredentials = async (task: Task): Promise<TaskAPI<
  firebaseAdmin.credential.Credential | undefined
>> => task(
  'Fetching Firebase credentials...',
  async ({ setError, setTitle, setWarning, task }) => {
    try {
      if (!firebaseServiceAccountPathDev) {
        setWarning('No dev path defined. Assuming production environment.');
        const { result } = await getFirebaseServiceAccountProductionCredential(task);
        if (!result) setWarning('No production credentials available.');
        return result;
      }
  
      const environmentName = await getEnvironmentName();
      if (environmentName === 'prod') {
        setWarning('Using production credentials.');
        const { result } = await getFirebaseServiceAccountProductionCredential(task);
        if (!result) setWarning('No production credentials available.');
        return result;
      }
  
      setTitle('Using dev Firebase credentials.');

      return firebaseAdmin.credential.cert(firebaseServiceAccountPathDev);
    } catch (e) {
      setError('Failed to fetch Firebase credentials.');
      console.error(e);
      throw e;
    }
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

export const initializeFirebase = async (task: Task) => {
  state.pendingInit = (async () => {
    state.inProgress = true;
  
    if (firebaseAdmin.apps.length > 0) {
      await task(
        'Cleaning up existing Firebase instance.',
        () => firebaseAdmin.app().delete()
      );
    }
  
    const { result: credential } = await fetchCredentials(task);

    const app = firebaseAdmin.initializeApp({ credential });
    state.db = firebaseAdmin.firestore(app);
    state.inProgress = false;
    state.pendingInit = null;
    return state.db;
  })();
  return state.pendingInit;
};

export const getFirebaseDb = (suppressInitialisation?: boolean) => {
  if (!state.db) {
    if (!suppressInitialisation) {
      if (state.inProgress) {
        log('Firebase is already initialising.', 'info');
      } else {
        // Deliberately not awaited, with the intention that it runs in the
        // background.
        task(
          'Database not yet instantiated. Initialising Firebase.', ({ task }) => initializeFirebase(task)
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

