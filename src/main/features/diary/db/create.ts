import {
  DiaryEntrySerialisation,
  diaryEntrySerialisationSchema,
} from "@/shared/features/diary";
import { diaryDb } from "../schema";

export const createNewDiaryEntry = async (
  entry: DiaryEntrySerialisation
): Promise<DiaryEntrySerialisation> => {
  // When creating, we must absolutely have a fresh audit log, created property
  // and id.
  const record = diaryEntrySerialisationSchema.parse(entry);

  try {
    const { inserted } = await diaryDb.insert(record);
    return inserted;
  } catch (error) {
    console.error("Create Failed:", error);
    throw error;
  }
};
