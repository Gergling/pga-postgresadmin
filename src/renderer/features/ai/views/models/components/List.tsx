import { trpcReact } from "@/renderer/libs/react-query";
import { Skeleton } from "@mui/material";
import { AiModelSource } from "./Source";
import { useMemo } from "react";
import { LlmSummary } from "@/shared/features/llm";

type SourceModel = { source: string; models: LlmSummary[]; };

const useAiModelsList = () => {
  const {
    data: raw,
    ...props
  } = trpcReact.ai.readAvailableModels.useQuery();

  const data = useMemo(() => {
    if (!raw) return [];

    const map = new Map<string, SourceModel>();
    raw.forEach((summary) => {
      const { source } = summary;
      const group = map.get(source) ?? { source, models: [] };
      map.set(source, { ...group, models: [...group.models, summary] });
    });
    return Array.from(map.values());
  }, [raw]);

  return {
    ...props,
    data,
  };
};

export const AiModelsList = () => {
  const {
    data,
    isLoading,
    isError,
    error
  } = useAiModelsList();

  console.log('models', data)

  if (isError) {
    console.error('An error occurred while retrieving ', error)
    return <>{error.message}</>;
  }

  if (isLoading) return <Skeleton variant={'rectangular'} />;

  return data?.map(({ models, source }) => <AiModelSource
    key={source}
    models={models}
    source={source}
  />);
};
