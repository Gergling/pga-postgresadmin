import { firestore } from "firebase-admin";
import { EmailFragment } from "../../../shared/email/types";
import { Mandatory } from "../../../shared/types";
import { mainFirebaseDb } from "../../libs/firebase";

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
    console.log('fromFirestore', snapshot.data());
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

export const fetchInboxFragments = async (): Promise<EmailFragment[]> => {
  try {
    const snapshot = await inboxFragmentCollection()
      .where('status', '==', 'new')
      .limit(10) // Small batches to prevent context overflow
      .get();
  
    if (snapshot.empty) return [];
  
    const fragments = snapshot.docs.map(doc => doc.data());
  
    return fragments;
  } catch (error) {
    console.error("Error fetching fragments:", error);
    throw error;
  }
};

export const batchEmail = (
  batch: FirebaseFirestore.WriteBatch,
  entries: Mandatory<EmailFragment, 'id'>[],
): FirebaseFirestore.WriteBatch => {
  entries.forEach(({ id, ...update }) => {
    const fragRef = inboxFragmentCollection().doc(id);
    batch.update(fragRef, update);
  });
  return batch;
};
