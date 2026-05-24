import {
  DiaryEntryPersistent,
  diaryEntryPersistentSchema,
} from "@/shared/features/diary";
import { diaryRepo } from "./schema";

export const createNewDiaryEntry = async (
  entry: DiaryEntryPersistent
): Promise<DiaryEntryPersistent> => {
  const record = diaryEntryPersistentSchema.parse(entry);

  try {
    return diaryRepo.create(record);
  } catch (error) {
    console.error("Create Failed:", error);
    throw error;
  }
};
