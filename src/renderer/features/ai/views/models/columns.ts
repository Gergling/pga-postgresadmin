import { GridColDef, GridColumnGroup } from "@mui/x-data-grid";
import { SerialisedModelSummary } from "@/shared/features/llm";
// import { OperationModelCellRenderer } from "./ModelClassificationCellRenderer";
import { createElement } from "react";
import { OperationModelClassification } from "../../shared";
import { formatPercentage } from "@/shared/utilities";

export const modelSummaryColumns: GridColDef<SerialisedModelSummary>[] = [
  {
    field: 'source',
    headerName: 'Source',
    renderCell: ({ row: { source } }) => source.toUpperCase(),
    width: 100,
  },
  {
    field: 'name',
    headerName: 'Model',
    renderCell: ({ row: { name } }) => name.toUpperCase(),
    width: 350,
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
    field: 'efficiency.infrastucture',
    headerName: 'Infrstr',
    renderCell: ({
      row: { efficiency: { infrastucture } }
    }) => infrastucture.toFixed(1),
  },
  {
    field: 'efficiency.ux',
    headerName: 'UX',
    renderCell: ({ row: { efficiency: { ux } } }) => ux.toFixed(1),
  },
  {
    field: 'count',
    headerName: 'Runs',
  },
  {
    field: 'rate',
    headerName: 'Rate',
    renderCell: ({ row: { rate } }) => formatPercentage(rate, {
      decimalPlaces: 1
    }),
  },
  {
    field: 'runtime.median',
    headerName: 'Median',
    renderCell: ({ row: { runtime: { median } } }) => median,
  },
  {
    field: 'runtime.mean',
    headerName: 'Mean',
    renderCell: ({ row: { runtime: { mean } } }) => mean,
  },
];

export const modelSummaryColumnGroups: GridColumnGroup[] = [
  {
    groupId: 'Efficiency Rating',
    children: [{ field: 'efficiency.infrastucture' }, { field: 'efficiency.ux' }],
  },
  {
    groupId: 'Runtime(ms)',
    children: [{ field: 'runtime.mean' }, { field: 'runtime.median' }],
  }
];
