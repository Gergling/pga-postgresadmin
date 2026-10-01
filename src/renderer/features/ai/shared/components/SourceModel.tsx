import { Stack } from "@mui/material";
import { LlmOperationSummary, LlmSummary } from "@/shared/features/llm";
import { DataGrid, GridCellRenderer, useDataGrid } from "@/renderer/shared/grid";
import { GridColDef } from "@mui/x-data-grid";
import { formatEfficiency, placeholderNaN } from "../utilities";
import { formatPercentage } from "@/shared/utilities";
import { OperationModelClassification } from "./OperationModelClassification";
import { createElement } from "react";

const columns: GridColDef<LlmOperationSummary>[] = [
  {
    field: 'operation',
    headerName: 'Operation',
    width: 150,
  },
  {
    field: 'reliability',
    headerName: 'Reliability',
    width: 75,
  },
  {
    field: 'classification',
    headerName: 'Classification',
    renderCell: ({ row }) => createElement(OperationModelClassification, row),
    width: 150,
  },
  {
    field: 'efficiency.infrastucture',
    headerName: 'Infrstr',
    renderCell: ({
      row: { efficiency: { infrastucture } } }
    ) => formatEfficiency(infrastucture),
  },
  {
    field: 'efficiency.ux',
    headerName: 'UX',
    renderCell: ({
      row: { efficiency: { ux } }
    }) => formatEfficiency(ux),
  },
  {
    field: 'rate',
    headerName: 'Rate',
    renderCell: ({
      row: { rate }
    }) => formatPercentage(rate, { decimalPlaces: 1 }),
  },
  {
    field: 'runtime.median',
    headerName: 'Median',
    renderCell: ({ row: { runtime: { median } } }) => placeholderNaN(median),
  },
  {
    field: 'runtime.mean',
    headerName: 'Mean',
    renderCell: ({
      row: { runtime: { mean } }
    }) => placeholderNaN(mean),
  },
];

const OperationGrid = ({
  modelOperations
}: { modelOperations: LlmOperationSummary[] }) => {
  const dataGridProps = useDataGrid({
    columns,
    getRowId: ({ reliability, operation }) => `${reliability}-${operation}`,
    rows: modelOperations,
  });
  return <DataGrid {...dataGridProps} />
};

export const AiSourceModel: GridCellRenderer<LlmSummary> = ({
  row: { operations }
}) => {
  return <Stack gap={2}>
    {/* {history && <AiModelData model={history} />} */}
    {/* {operations.length > 0 ? <OperationGrid modelOperations={operations} /> : ''} */}
  </Stack>;
};
