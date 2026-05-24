import { tRPC } from "@/main/config";
import { createNewDiaryEntry, fetchRecentDiaryEntries } from "./db";
import { diaryEntryTransferSchema } from "@shared/features/diary";

export const diaryRouter = tRPC.router({
  create: tRPC.procedure.input(diaryEntryTransferSchema).mutation(
    async ({ input }) => {
      const payload = await createNewDiaryEntry(input.payload);
      return diaryEntryTransferSchema.parse({ ...input, payload });
    },
  ),
  fetchRecent: tRPC.procedure.query(async () => {
    const entries = await fetchRecentDiaryEntries();
    return entries.map(entry => diaryEntryTransferSchema.parse({ ...entry, payload: entry }));
  }),
});
