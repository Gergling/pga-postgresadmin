import admin, { credential, firestore, initializeApp } from 'firebase-admin';
import * as dotenv from 'dotenv';
import { getEnvironment } from '../../shared/environment';
import { log } from '../../shared/logging';

dotenv.config();

let db: firestore.Firestore | null = null;

export const initializeFirebase = () => {
  log(`Initializing Firebase...`, 'info');
  const env = getEnvironment();
  console.info(`[${new Date().toLocaleString()}]: \x1b[36mUsing \x1b[33m${env}\x1b[36m environment.\x1b[0m`);
  const envVar = env === 'prod' ? 'FIREBASE_SERVICE_ACCOUNT_PATH' : 'FIREBASE_SERVICE_ACCOUNT_PATH_DEV';
  log(`Service account path environment variable name is ${envVar}.`, 'info');
  const serviceAccountPath = process.env[envVar];

  if (!serviceAccountPath) throw new Error(`Missing ${envVar} in .env.`);
  log(`Service account path ${serviceAccountPath}.`, 'success');

  if (admin.apps.length > 0) {
    log('Cleaning up existing Firebase instance...', 'info');
    admin.app().delete(); 
  }

  log(`Initializing Firebase for ${env}...`, 'info');
  const app = initializeApp({
    credential: credential.cert(serviceAccountPath)
  });
  
  db = firestore(app);
  log(`Initialized Firebase for ${env}.`, 'success');
  return db;
};

export const getFirebaseDb = () => {
  if (!db) return initializeFirebase();
  return db;
};
