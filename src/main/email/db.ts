import { firestore } from "firebase-admin";
import { EmailFragment } from "../../shared/email/types";
import { mainFirebaseDb } from "../libs/firebase";

const firestoreEmailFragmentProps: (keyof Omit<EmailFragment, 'db'>)[] = [
  'body', 'from', 'id', 'receivedAt', 'source', 'status', 'subject'
];

const fragmentConverter: firestore.FirestoreDataConverter<EmailFragment> = {
  toFirestore: (emailFragment) => firestoreEmailFragmentProps.reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: emailFragment[prop],
    }),
    {} as firestore.WithFieldValue<firestore.DocumentData>
  ),
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
