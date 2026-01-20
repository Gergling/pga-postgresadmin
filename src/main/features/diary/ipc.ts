import { DiaryEntry, DiaryIpc } from "../../../shared/features/diary/types";
import { createNewDiaryEntry, fetchRecentDiaryEntries, updateDiaryEntry } from "./db";
import { triageCommittedDiaryEntries } from "./triage";

export const diaryIpc = (): DiaryIpc => {
  return {
    create: {
      entry: createNewDiaryEntry
    },
    read: {
      recent: fetchRecentDiaryEntries,
    },
    update: {
      set: async (entryId: string, newData: Partial<DiaryEntry>, immediateConvergence?: boolean) => {
        const entry = await updateDiaryEntry(entryId, newData);
        if (newData.status === 'committed') {
          if (immediateConvergence) {
            // initiate triage for this 
          } else {
            // initiate triage for committed
            triageCommittedDiaryEntries();
          }
        }
        return entry;
      }
    },
  };
};
