import { useMemo } from "react";
import { diaryIpcCodec } from "@/shared/features/diary";
import { trpcReact } from "@/renderer/libs/react-query";

export const useDiaryEntryList = () => {
  const {
    data: recentEntriesTransfer,
    error: recentDiaryEntriesError,
    isError: isRecentDiaryEntriesError,
    isLoading: isRecentDiaryEntriesLoading,
    refetch: fetchRecentDiaryEntries,
  } = trpcReact.diary.fetchRecent.useQuery();

  // Transform into a manageable format.
  const recentDiaryEntries = useMemo(() => recentEntriesTransfer?.map(
    (entry) => diaryIpcCodec.decode(entry)
  ) ?? [], [recentEntriesTransfer]);

  return {
    isRecentDiaryEntriesError,
    isRecentDiaryEntriesLoading,
    recentDiaryEntries,
    recentDiaryEntriesError,
    fetchRecentDiaryEntries,
  };
};
