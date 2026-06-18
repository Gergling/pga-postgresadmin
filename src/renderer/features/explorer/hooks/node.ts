import { useMemo } from "react";
import { getFrequentPaths } from "@/shared/utilities";
import { trpcReact } from "@/renderer/libs/react-query";
import { explorerHistoryStore } from "../stores";

export const useExplorerNode = (path: string) => {
  const { history } = explorerHistoryStore();
  const frequent = useMemo(() => getFrequentPaths(history), [history]);
  const {
    data, isLoading, isError, error
  } = trpcReact.explorer.node.useQuery(path);
  const children = useMemo(() => {
    if (!data?.children) return [];
    return data.children.map((item) => {
      const isFrequent = frequent.includes(item.absolutePath);
      return { ...item, isFrequent };
    }).sort((a, b) => {
      // Most frequent first.
      if (a.isFrequent && !b.isFrequent) return -1;
      if (!a.isFrequent && b.isFrequent) return 1;
      // Directories displayed first.
      if (a.meta.isDirectory && !b.meta.isDirectory) return -1;
      if (!a.meta.isDirectory && b.meta.isDirectory) return 1;
      // Alphabetical.
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }, [data, frequent]);

  return {
    error, isLoading, isError,
    frequent, history,
    children, parent: data?.parent, current: data?.current,
  };
};
