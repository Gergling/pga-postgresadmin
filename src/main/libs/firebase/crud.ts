import { getFirebaseDb } from "./config";
import { FirebaseAddDoc } from "./types";

export const addFirebaseDoc: FirebaseAddDoc = (
  collectionName,
  fragment
) => getFirebaseDb().collection(collectionName).add(fragment);
