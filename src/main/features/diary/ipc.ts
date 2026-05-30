import {
  DiaryEntryTransfer,
  diaryEntryTransferSchema
} from "@/shared/features/diary";
import { tRPC } from "@/main/config";
import { createNewDiaryEntry, fetchRecentDiaryEntries } from "./db";

export const diaryRouter = tRPC.router({
  create: tRPC.procedure.input(diaryEntryTransferSchema).mutation(
    ({ input }): Promise<DiaryEntryTransfer> => createNewDiaryEntry(input),
  ),
  fetchRecent: tRPC.procedure.query(() => fetchRecentDiaryEntries()),
});
