import { trpcReact } from "@/renderer/libs/react-query";
import { Skeleton } from "@mui/material";
import { AiOperation } from "./Item";

export const AiOperationsList = () => {
  const {
    data,
    isLoading,
    isError,
    error
  } = trpcReact.ai.readOperationSummaries.useQuery();

  if (isError) {
    console.error('An error occurred while retrieving ', error)
    return <>{error.message}</>;
  }

  if (isLoading) return <Skeleton variant={'rectangular'} />;

  return data?.map((operation) => <AiOperation
    key={operation.name}
    {...operation}
  />);
};
