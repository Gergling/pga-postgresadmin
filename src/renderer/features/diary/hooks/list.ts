import { useMemo } from "react";
import { diaryIpcCodec } from "@/shared/features/diary";
import { trpcReact } from "@/renderer/libs/react-query";

export const useDiaryEntryList = () => {
  const {
    data: recentEntriesTransfer,
  } = trpcReact.diary.fetchRecent.useQuery();

  // Transform into a manageable format.
  const recentDiaryEntries = useMemo(() => recentEntriesTransfer?.map(
    (entry) => diaryIpcCodec.decode(entry)
  ) ?? [], [recentEntriesTransfer]);

  return {
    recentDiaryEntries,
  };
};
