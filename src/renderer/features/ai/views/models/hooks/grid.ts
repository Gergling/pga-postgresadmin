import { useDataGrid } from "@/renderer/shared/grid";
import { trpcReact } from "@/renderer/libs/react-query";
import { modelSummaryColumnGroups, modelSummaryColumns } from "../columns";
import { useModelSummaryTransformer } from "./transformer";
import { useState } from "react";
import { useLlmOperationUtils } from "../../../shared";

export const useLlmOperationModelSummaryGrid = (operationCode: string) => {
  const {
    invalidate
  } = useLlmOperationUtils({ operationCode });
  const {
    data,
    isLoading: modelsIsLoading,
    isError: modelsIsError,
    error: modelsError,
  } = trpcReact.ai.readOperationModelSummaries.useQuery(operationCode);

  const [isExperimental, setIsExperimental] = useState(false);

  const sorted = useModelSummaryTransformer({
    data: data ?? [], experimental: isExperimental
  });

  const dataGridProps = useDataGrid({
    columnGroupingModel: modelSummaryColumnGroups,
    columns: modelSummaryColumns,
    getRowHeight: () => 'auto',
    getRowId: ({ name }) => name,
    rows: sorted,
  });

  return {
    dataGridProps,
    modelsError,
    modelsIsError,
    modelsIsLoading,
    isExperimental,
    setIsExperimental
  };
};
