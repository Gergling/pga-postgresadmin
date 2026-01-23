import { Optional } from "../../../shared/types";
import { DiaryEntry } from "../../../shared/features/diary/types";
import { UserTask } from "../../../shared/features/user-tasks";
import { getFirebaseDb } from "../../libs/firebase";
import { emitRitualTelemetry } from "../ai/ipc";
import { generateTaskContent, generateProposedTasks, TriageTasksResponse } from "../tasks";
import { batchDiary, fetchCommittedDiaryEntries } from "./db";

const source = 'diary';

const simplifyEntry = ({
  created, id, text,
}: DiaryEntry) => ({
  created: (new Date(created)).toISOString(),
  id, text,
});

const batchUpdateFactory = (
  entries: DiaryEntry[],
) => (
  batch: FirebaseFirestore.WriteBatch,
  success: boolean,
) => {
  const processed = entries.map((entry): DiaryEntry => ({ ...entry, status: success ? 'processed' : 'committed' }));
  const partial = processed.map(({ id, status }) => ({ id, status }));
  batchDiary(batch, partial);
  return processed;
};

const updateProcessingEntries = async (committed: DiaryEntry[]) => {
  const processing: DiaryEntry[] = committed.map((props) => ({ ...props, status: 'processing' }));
  const batch = getFirebaseDb().batch();

  batchDiary(batch, processing.map(({ id, status }) => ({ id, status })));
  await batch.commit();
  return processing;
};

const emit = (
  message: string,
  entries: Optional<DiaryEntry, 'created' | 'text'>[],
  tasks?: UserTask[],
) => {
  emitRitualTelemetry({
    message,
    triage: {
      diary: entries.map(({ id, created, status }) => ({ created, id, status })),
      tasks,
    }
  });
}

export const triageCommittedDiaryEntries = async (): Promise<TriageTasksResponse> => {
  try {
    const committed = await fetchCommittedDiaryEntries();
    const simplifiedEntries = committed.map(simplifyEntry);
    const simplifiedEntryJson = JSON.stringify(simplifiedEntries, null, 2);

    // Update the status of the entries to "processing".
    const processing = await updateProcessingEntries(committed);
    emit("Librarian is triaging the diary.", processing);

    const analysis = await generateTaskContent(source, simplifiedEntryJson);

    const { batchUpdatedResponse: processed, tasks } = await generateProposedTasks(analysis, batchUpdateFactory(processing));

    emit("Librarian has completed a diary triage.", processed, tasks);

    return { source, status: 'success', message: `Updated ${processed.length} entries.` };
  } catch (error) {
    return { source, status: 'error', message: `Diary Triage Failed: ${error}` };
  }
};

// Figure out how this is called before choosing the arguments. It *needs* the
// simplified contents.
// export const triageDiaryEntry = async (id: string): Promise<TriageTasksResponse> => {
//   try {
//     const baseEntry: Mandatory<DiaryEntry, 'status'> = { status: 'processing' };
//     const updatedEntry = await updateDiaryEntry(id, baseEntry);
//     const simplifiedEntry = simplifyEntry(entry);
//     const simplifiedEntryJson = JSON.stringify(simplifiedEntry, null, 2);

//     emit("Librarian is triaging the diary entry.", [{ ...entry, ...baseEntry }]);

//     // 2. Prepare the prompt
//     const analysis = await generateTaskContent(source, simplifiedEntryJson);

//     await generateProposedTasks(analysis, batchUpdateFactory([entry]));

//     return { source, status: 'success', message: `Updated entry with id:'${id}'` };
//   } catch (error) {
//     return { source, status: 'error', message: `Diary Triage Entry Failed for id:'${id}': ${error}` };
//   }
// };
