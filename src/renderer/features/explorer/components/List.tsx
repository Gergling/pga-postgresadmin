import { trpcReact } from "@/renderer/libs/react-query";
import { List } from "@/renderer/shared/list";
import { ExplorerItem } from "./Item";
import { Skeleton } from "@mui/material";

export const ExplorerList = ({ path }: { path: string; }) => {
  const { data, isLoading, isError, error } = trpcReact.explorer.list.useQuery(path);

  return <>
    {isLoading && <Skeleton variant={'rectangular'} />}
    {isError && error}
    {data && <List>{data.map((item) => <ExplorerItem {...item} />)}</List>}
  </>;
};
