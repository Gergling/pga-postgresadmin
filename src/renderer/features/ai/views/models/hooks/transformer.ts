import { useMemo } from "react";
import {
  SerialisedModelSummary,
  transformLlmModelSummaryFactory
} from "@/shared/features/llm";

export const useModelSummaryTransformer = ({
  data,
  experimental,
}: {
  data: SerialisedModelSummary[];
  experimental: boolean;
}) => {
  const transformer = useMemo(
    () => transformLlmModelSummaryFactory(data),
    [data]
  );

  const sorted = useMemo(
    () => transformer.sort(experimental),
    [experimental, transformer]
  );

  return sorted;
};
