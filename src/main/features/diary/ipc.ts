import {
  DiaryEntryTransfer,
  diaryEntryTransferSchema
} from "@/shared/features/diary";
import { tRPC } from "@/main/config";
import { createNewDiaryEntry, fetchRecentDiaryEntries } from "./db";

export const diaryRouter = tRPC.router({
  create: tRPC.procedure.input(diaryEntryTransferSchema).mutation(
    async ({ input }): Promise<DiaryEntryTransfer> => {
      const payload = await createNewDiaryEntry(input);
      return diaryEntryTransferSchema.parse({ ...input, payload });
    },
  ),
  fetchRecent: tRPC.procedure.query(async () => {
    const entries = await fetchRecentDiaryEntries();
    return entries.map(entry => diaryEntryTransferSchema.parse({ ...entry, payload: entry }));
  }),
});
