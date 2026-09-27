import { useState } from "react";
import { useDataGrid } from "@/renderer/shared/grid";
import { LlmOperation } from "@/shared/features/llm";
import { AiSummaryCellRenderer } from "../../../shared";
import { modelSummaryColumnGroups, modelSummaryColumns } from "../columns";
import { useModelSummaryTransformer } from "./transformer";

export const useLlmOperationModelSummaryGrid = (
  operationHistory: LlmOperation
) => {
  const [isExperimental, setIsExperimental] = useState(false);

  const { experimental, selected, stable } = useModelSummaryTransformer({
    data: operationHistory.models ?? [], experimental: isExperimental
  });

  const dataGridProps = useDataGrid({
    columnGroupingModel: modelSummaryColumnGroups,
    columns: modelSummaryColumns,
    getRowHeight: () => 'auto',
    getRowId: ({
      model, operation, source
    }) => [model, operation, source].join('-'),
    rows: selected,
  }, {
    masterDetailConfig: {
      cellRenderer: AiSummaryCellRenderer,
    },
  });

  return {
    dataGridProps,
    isExperimental,
    models: { experimental, stable },
    setIsExperimental
  };
};
