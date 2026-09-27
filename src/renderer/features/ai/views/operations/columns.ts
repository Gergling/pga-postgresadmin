import { createElement } from "react";
import { GridColDef, GridColumnGroup } from "@mui/x-data-grid";
import { LlmHistoryRelative } from "@/shared/features/llm";
import { OperationModelClassification } from "../../shared";

const formatEfficiency = (
  value: number
) => (Number.isNaN(value) ? 0 : value).toFixed(1);

export const modelSummaryColumns: GridColDef<LlmHistoryRelative>[] = [
  {
    field: 'source',
    headerName: 'Source',
    renderCell: ({ row: { source } }) => source.toUpperCase(),
    width: 75,
  },
  {
    field: 'name',
    headerName: 'Model',
    renderCell: ({ row: { model } }) => model.toUpperCase(),
    width: 300,
  },
  {
    field: 'classification',
    headerName: 'Classification',
    renderCell: (
      { row }
    ) => createElement(OperationModelClassification, row),
    width: 150,
  },
  {
    field: 'efficiency',
    headerName: 'Eff.',
    renderCell: ({
      row: { success: { efficiency: { infrastucture, ux } } }
    }) => [infrastucture, ux].map(formatEfficiency).join(' | '),
    width: 115,
  },
  {
    field: 'count',
    headerName: 'Runs',
    renderCell: ({
      row: { aggregation: { successful, terminal, total } }
    }) => [successful, terminal, total].join(' | '),
    width: 125,
  },
];

export const modelSummaryColumnGroups: GridColumnGroup[] = [
  {
    groupId: 'Runtime(ms)',
    children: [{ field: 'runtime.mean' }, { field: 'runtime.median' }],
  }
];
