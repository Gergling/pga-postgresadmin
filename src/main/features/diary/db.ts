import { firestore } from "firebase-admin";
import { DiaryEntry, DiaryIpc } from "../../../shared/features/diary/types";
import { Mandatory, Optional } from "../../../shared/types";
import { mainFirebaseDb } from "../../libs/firebase";

type DiaryEntryDb = Optional<DiaryEntry, 'id'>;

const converter: firestore.FirestoreDataConverter<Optional<DiaryEntry, 'id'>> = {
  toFirestore: (task) => task,
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return data as DiaryEntry;
  }
};

export const diaryEntryCollection = () => mainFirebaseDb
  .collection('diary_entries')
  .withConverter(converter);

export const createNewDiaryEntry: DiaryIpc['create']['entry'] = async (entryEnvelope) => {
  // Envelope id is a temporary id generated from the renderer. It should simply be returned.
  const entry = entryEnvelope.content;
  const record: DiaryEntryDb = {
    created: Date.now(),
    status: 'draft',
    ...entry
  };
  try {
    const { id } = await diaryEntryCollection().add(record);
    return { ...entryEnvelope, content: { ...record, id } };
  } catch (error) {
    console.error("Create Failed:", error);
    throw error;
  }
};

// Mainly for rendering.
export const fetchRecentDiaryEntries = async (): Promise<DiaryEntry[]> => {
  const ref = diaryEntryCollection();
  const recentQuery = ref.orderBy('created', 'desc').limit(10);
  const statusQuery = ref.where('status', 'in', ['processing', 'committed', 'draft']);

  const [recentSnapshot, statusSnapshot] = await Promise.all([
    recentQuery.get(),
    statusQuery.get(),
  ]);

  const entryMap = new Map();

  recentSnapshot.forEach(doc => entryMap.set(doc.id, { id: doc.id, ...doc.data() }));
  statusSnapshot.forEach(doc => entryMap.set(doc.id, { id: doc.id, ...doc.data() }));

  return Array.from(entryMap.values()).sort((a, b) => b.created - a.created);
};

// For processing.
export const fetchCommittedDiaryEntries = async (): Promise<DiaryEntry[]> => {
  const snapshot = await diaryEntryCollection()
    .where('status', '==', 'committed')
    .orderBy('created', 'desc')
    .get();

  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));
};
export const fetchDiaryEntry = async (id: string): Promise<DiaryEntry> => {
  const snapshot = await diaryEntryCollection().doc(id).get();
  const data = snapshot.data();
  if (!data) throw new Error(`Diary entry not found for id: ${id}`);

  return { ...data, id: snapshot.id };
};
export const fetchProcessingCount = async (): Promise<number> => {
  const snapshot = await diaryEntryCollection()
    .where('status', '==', 'processing').count().get();

  return snapshot.data().count;
};

export const updateDiaryEntry = async (
  id: string,
  newData: Partial<DiaryEntry>,
): Promise<Mandatory<DiaryEntry, 'id'>> => {
  // newData should have at least one property.
  const taskRef = diaryEntryCollection().doc(id);

  // Diary entry should be updated for id.
  try {
    // Update the diary entry.
    await taskRef.update(newData);
    return { ...newData, id };
  } catch (error) {
    console.error("Update Failed:", error);
    throw error;
  }
};

export const batchDiary = (
  batch: FirebaseFirestore.WriteBatch,
  entries: Mandatory<DiaryEntry, 'id'>[],
): FirebaseFirestore.WriteBatch => {
  entries.forEach(({ id, ...update }) => {
    const fragRef = diaryEntryCollection().doc(id);
    batch.update(fragRef, update);
  });
  return batch;
};
