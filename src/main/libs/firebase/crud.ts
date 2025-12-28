import { mainFirebaseDb } from "./config";
import { FirebaseAddDoc } from "./types";

export const addFirebaseDoc: FirebaseAddDoc = (
  collectionName,
  fragment
) => mainFirebaseDb.collection(collectionName).add(fragment);
