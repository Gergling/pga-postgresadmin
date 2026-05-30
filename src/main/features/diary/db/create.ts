import {
  diaryEntrySchema,
  DiaryEntryTransfer,
  diaryEntryTransferSchema,
} from "@/shared/features/diary";
import { diaryRepo } from "../schema";

export const createNewDiaryEntry = async (
  { creationKey, data: { text } }: DiaryEntryTransfer
): Promise<DiaryEntryTransfer> => {
  // When creating, we must absolutely have a fresh audit log, created property
  // and id.
  const record = diaryEntrySchema.parse({
    audit: [], created: undefined, id: undefined, data: { text },
  });

  try {
    const created = await diaryRepo.create(record);
    // Creation must absolutely pass the creationKey back in.
    return diaryEntryTransferSchema.parse({ ...created, creationKey });
  } catch (error) {
    console.error("Create Failed:", error);
    throw error;
  }
};
