import {
  DiaryEntrySerialisation,
  diaryEntrySerialisationSchema
} from "@/shared/features/diary";
import { tRPC } from "@/main/config";
import {
  createNewDiaryEntry,
  fetchRecentDiaryEntries,
  updateDiaryEntry
} from "./db";

export const diaryRouter = tRPC.router({
  create: tRPC.procedure.input(diaryEntrySerialisationSchema).mutation(
    ({ input }): Promise<DiaryEntrySerialisation> => createNewDiaryEntry(input),
  ),
  fetchRecent: tRPC.procedure.query(() => fetchRecentDiaryEntries()),
  update: tRPC.procedure.input(diaryEntrySerialisationSchema).mutation(
    ({ input }): Promise<void> => updateDiaryEntry(input),
  ),
});
