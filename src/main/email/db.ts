import { firestore } from "firebase-admin";
import { EmailFragment } from "../../shared/email/types";
import { mainFirebaseDb } from "../libs/firebase";

const fragmentConverter: firestore.FirestoreDataConverter<EmailFragment> = {
  toFirestore({ db, ...fragment}) {
    return fragment; // Logic to clean data before saving
  },
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return {
      ...data,
      db: {
        id: snapshot.id,
        source: 'firebase'
      },
    } as EmailFragment;
  }
};

export const inboxFragmentCollection = () => mainFirebaseDb
  .collection('inbox_fragments')
  .withConverter(fragmentConverter);
