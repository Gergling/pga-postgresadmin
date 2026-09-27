import { useMemo } from "react";
import {
  LlmHistoryRelative,
  transformLlmModelSummaryFactory
} from "@/shared/features/llm";

export const useModelSummaryTransformer = ({
  data,
  experimental,
}: {
  data: LlmHistoryRelative[];
  experimental: boolean;
}) => {
  const presorted = useMemo(
    () => transformLlmModelSummaryFactory(data),
    [data]
  );

  const sorted = useMemo(
    () => {
      if (experimental) return presorted.experimental;
      return presorted.stable;
    },
    [experimental, presorted]
  );

  return {
    ...presorted,
    selected: sorted
  };
};
