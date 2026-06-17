import { Skeleton } from "@mui/material";
import { useMemo } from "react";
import { getFrequentPaths } from "@/shared/utilities";
import { List } from "@/renderer/shared/list";
import { trpcReact } from "@/renderer/libs/react-query";
import { explorerHistoryStore } from "../stores";
import { ExplorerItem } from "./Item";

export const ExplorerList = ({ path }: { path: string; }) => {
  const { history } = explorerHistoryStore();
  const frequent = useMemo(() => getFrequentPaths(history), [history]);
  const {
    data, isLoading, isError, error
  } = trpcReact.explorer.list.useQuery(path);
  const items = useMemo(() => (data ?? []).map((item) => {
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
  }), [data, frequent]);

  return <>
    {isLoading && <Skeleton variant={'rectangular'} />}
    {isError && error}
    {items.length > 0 && <List>{items.map((item) => <ExplorerItem
      key={item.absolutePath} {...item}
    />)}</List>}
  </>;
};
