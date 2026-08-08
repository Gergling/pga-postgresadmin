// Cases:
// Update status.
// "draft" -> "committed"
// "committed" -> "processing"
// "processing" -> "processed", this will include the task ids, or other types
// of ids
// "processing" -> "rejected"
// Update things like the task ids.

import {
  DiaryEntrySerialisation,
  diaryEntrySerialisationSchema
} from "@/shared/features/diary";
import { diaryDb } from "../schema";

// TODO: All committed items with a type of undefined id will be brought into a
// "queue" for processing. If no relevant ids are found, it will be put in as an
// empty array.

export const updateDiaryEntry = async (entry: DiaryEntrySerialisation) => {
  const envelope = diaryEntrySerialisationSchema.parse(entry);
  await diaryDb.update({ id: envelope.id }, envelope);
};
