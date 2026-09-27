import { createElement } from "react";
import { GridColDef, GridColumnGroup } from "@mui/x-data-grid";
import {
  LlmSummary,
} from "@/shared/features/llm";
import { ModelLocal } from "../../shared";

// Budget master/detail hacking:
// Assume we apply to the first column to begin with (can apply row-spanning
// later if we want).
// We have a master/detail renderer which is a cell renderer.
// We transform our row data. It simply doubles-up the rows, where the second
// row is detail, and wrapped with a type for the master-detail (could just be
// isDetail).
// The colspan is calculated based on the number of columns and whether the row
// data is master/detail or not.

// So we have a special hook:
// We should use the existing wrapper hook to allow for options such as
// master/detail. Initially, the master/detail config can just supply an
// optional boolean.

// Columns are extended with colspan.
// Rows are extended with something like `gridRowIsDetail?: boolean;` and
// otherwise duplicated.

export const modelSummaryColumns: GridColDef<LlmSummary>[] = [
  {
    field: 'name',
    flex: 1,
    headerName: 'Model',
    renderCell: ({ row: { model } }) => model.toUpperCase(),
    // width: 350,
  },
  {
    field: 'local',
    headerName: 'Local',
    renderCell: ({
      row: { traits: { local } }
    }) => createElement(ModelLocal, { local }),
    width: 75,
  },
  // {
  //   field: 'classification',
  //   headerName: 'Classification',
  //   renderCell: (
  //     { row: { history } }
  //   ) => history ? createElement(OperationModelClassification, history) : '-',
  //   width: 150,
  // },
  // {
  //   field: 'efficiency.infrastucture',
  //   headerName: 'Infrstr',
  //   renderCell: ({
  //     row: { history } }
  //   ) => history ? formatEfficiency(history.efficiency.infrastucture) : '-',
  // },
  // {
  //   field: 'efficiency.ux',
  //   headerName: 'UX',
  //   renderCell: ({
  //     row: { history }
  //   }) => history ? formatEfficiency(history.efficiency.ux) : '-',
  // },
  // {
  //   field: 'count',
  //   headerName: 'Runs',
  //   renderCell: ({
  //     row: { history }
  //   }) => history ? getLlmModelRunCountRender({ row: history }) : '-',
  // },
  // {
  //   field: 'rate',
  //   headerName: 'Rate',
  //   renderCell: ({
  //     row: { history }
  //   }) => history ? formatPercentage(Number.isNaN(history.rate) ? 0 : history.rate, {
  //     decimalPlaces: 1
  //   }) : '-',
  // },
  // {
  //   field: 'runtime.median',
  //   headerName: 'Median',
  //   renderCell: ({
  //     row: { history }
  //   }) => history ? placeholderNaN(history.runtime.median) : '-',
  // },
  // {
  //   field: 'runtime.mean',
  //   headerName: 'Mean',
  //   renderCell: ({
  //     row: { history }
  //   }) => history ? placeholderNaN(history.runtime.mean) : '-',
  // },
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
