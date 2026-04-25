import firebaseAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';
import task, { TaskAPI } from 'tasuku';
import { log } from '@/main/shared/logging';
import {
  fetchAppSettings,
  getElectronSetting,
} from '../../shared/settings';

dotenv.config();

const firebaseServiceAccountPathDev = process.env.FIREBASE_SERVICE_ACCOUNT_PATH_DEV;

const getEnvironmentName = async () => {
  const environmentName = (await getElectronSetting('env')) ?? 'dev';
  return environmentName;
};

const getFirebaseServiceAccountProductionCredential = async (): Promise<
  firebaseAdmin.credential.Credential
> => {
  const settings = await fetchAppSettings();
  const account = JSON.parse(settings.firebase.production);
  return firebaseAdmin.credential.cert(account);
}

const fetchCredentials = async (): Promise<TaskAPI<
  firebaseAdmin.credential.Credential
>> => task(
  'Fetching Firebase credentials...',
  async ({ setError, setTitle, setWarning }) => {
    try {
      if (!firebaseServiceAccountPathDev) {
        setWarning('No dev path defined. Assuming production environment.');
        const result = await getFirebaseServiceAccountProductionCredential();
        setWarning('No dev path defined. Got production credentials.');
        return result;
      }
  
      const environmentName = await getEnvironmentName();
      if (environmentName === 'prod') {
        const result = await getFirebaseServiceAccountProductionCredential();
        setWarning('Using production credentials.');
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
  inProgress: boolean;
  db: firebaseAdmin.firestore.Firestore | null;
} = {
  inProgress: false,
  db: null,
};

export const initializeFirebase = async () => {
  state.inProgress = true;

  await task('Checking for existing Firebase instance...', async ({
    setError, setTitle
  }) => {
    if (firebaseAdmin.apps.length > 0) {
      try {
        setTitle('Cleaning up existing Firebase instance...');
        await firebaseAdmin.app().delete();
        setTitle('Firebase instance cleaned up.');
        return;
      } catch (e) {
        setError('Failed to clean up existing Firebase instance.');
        console.error(e);
        throw e;
      }
    }
    setTitle('No existing Firebase instance found.');
  });

  const { result: credential } = await fetchCredentials();
  const app = firebaseAdmin.initializeApp({ credential });
  state.db = firebaseAdmin.firestore(app);
  state.inProgress = false;
  return state.db;
};

export const getFirebaseDb = async (suppressInitialisation = false) => {
  if (!state.db && !suppressInitialisation) {
    if (state.inProgress) log('Firebase is initialising...', 'info');
    return initializeFirebase();
  }
  return state.db;
};
