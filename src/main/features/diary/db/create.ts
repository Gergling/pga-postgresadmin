import {
  DiaryEntrySerialisation,
  diaryEntrySerialisationSchema,
} from "@/shared/features/diary";
import { diaryDb, diaryRepo } from "../schema";

export const createNewDiaryEntry = async (
  { data: { text } }: DiaryEntrySerialisation
): Promise<DiaryEntrySerialisation> => {
  // When creating, we must absolutely have a fresh audit log, created property
  // and id.
  const record = diaryEntrySerialisationSchema.parse({
    data: { text },
  });

  try {
    const { inserted } = await diaryDb.insert(record);
    return inserted;
  } catch (error) {
    console.error("Create Failed:", error);
    throw error;
  }
};
