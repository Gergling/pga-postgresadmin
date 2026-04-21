import firebaseAdmin from 'firebase-admin';
import * as dotenv from 'dotenv';
import task, { TaskAPI } from 'tasuku';
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

let db: firebaseAdmin.firestore.Firestore | null = null;

export const initializeFirebase = async () => {
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
  db = firebaseAdmin.firestore(app);
  return db;
};

export const getFirebaseDb = async (suppressInitialisation = false) => {
  if (!db && !suppressInitialisation) return initializeFirebase();
  return db;
};
