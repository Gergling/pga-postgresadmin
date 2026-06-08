import { UseQueryResult } from "@tanstack/react-query";
import { LockingProcess } from "@/main/features";
import { trpcReact } from "@/renderer/libs/react-query";
import { useMemo } from "react";

export type ExplorerLock = 
  | 'error'
  | 'loading'
  | 'open'
  | 'unknown'
  | LockingProcess[]
;

const getResult = ({
  isError, isLoading, data
}: Pick<
  UseQueryResult<LockingProcess[]>, 'isError' | 'isLoading' | 'data'
>): ExplorerLock => {
  if (isError) return 'error';
  if (isLoading) return 'loading';
  if (data) {
    console.log('explorer locks', data)
    if (data.length === 0) return 'open';
    return data;
  }
  return 'unknown';
}

export const useExplorerLocks = (path: string) => {
  const props = trpcReact.explorer.locks.useQuery(path, { enabled: false });

  const result = useMemo(() => getResult(props), [props]);

  const refetch = () => {
    // Note: Should probably disable until settled.
    if (!Array.isArray(result)) props.refetch();
  }

  return {
    result,
    refetch,
  };
};
