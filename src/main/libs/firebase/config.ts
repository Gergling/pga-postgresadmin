import { credential, firestore, initializeApp } from 'firebase-admin';
import * as dotenv from 'dotenv';
import { getEnvironment } from '../../shared/environment';
import { log } from '../../shared/logging';

dotenv.config();

log(`Getting service account path.`, 'info');
const env = getEnvironment();
console.log(`[${new Date().toLocaleString()}]: \x1b[36mUsing \x1b[33m${env}\x1b[36m environment.\x1b[0m`);
const envVar = env === 'prod' ? 'FIREBASE_SERVICE_ACCOUNT_PATH' : 'FIREBASE_SERVICE_ACCOUNT_PATH_DEV';
log(`Service account path environment variable name is ${envVar}.`, 'info');
const serviceAccountPath = process.env[envVar];

if (!serviceAccountPath) {
  throw new Error(`Missing ${envVar} in .env`);
}

log(`Service account path ${serviceAccountPath}.`, 'success');

const app = initializeApp({
  credential: credential.cert(serviceAccountPath)
});

export const mainFirebaseDb = firestore(app);
