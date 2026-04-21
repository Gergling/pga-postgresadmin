import firebaseAdmin from 'firebase-admin';
import { FirebaseDatabaseStatus } from '@shared/lib/firebase';

export const getDatabaseStatus = (
  db: firebaseAdmin.firestore.Firestore | null
): FirebaseDatabaseStatus => {
  if (!db) return 'offline';
  return 'initialised';
};
