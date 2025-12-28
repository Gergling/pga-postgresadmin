import { credential, firestore, initializeApp } from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_PATH in .env");
}

const app = initializeApp({
  credential: credential.cert(serviceAccountPath)
});

export const mainFirebaseDb = firestore(app);
