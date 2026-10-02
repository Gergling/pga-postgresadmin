import { GridColDef } from "@mui/x-data-grid";
import { DataGrid, useDataGrid } from "@/renderer/shared/grid";
import { DashboardValue, PanelDataItem } from "@/renderer/shared/dashboard";
import { useHomePanels } from "../hooks";

const columns: GridColDef<PanelDataItem>[] = [
  {
    field: 'name',
    headerName: 'Name',
  },
  {
    field: 'label',
    headerName: 'Label',
  },
  {
    field: 'display',
    headerName: 'Display',
  },
  {
    field: 'feature',
    headerName: 'Feature',
  },
  {
    field: 'weights.achievement',
    headerName: 'Achievement',
    renderCell: ({ row: { weights: { achievement } } }) => achievement,
  },
  {
    field: 'weights.opportunity',
    headerName: 'Opportunity',
    renderCell: (params) => params.row.weights.opportunity,
  },
  {
    field: 'value',
    headerName: 'Value',
    renderCell: (params) => <DashboardValue {...params.row} />
  },
];

export const HomePanelsList = () => {
  const { all } = useHomePanels();
  const dataGridProps = useDataGrid({
    columns,
    rows: all,
  });
  return <DataGrid {...dataGridProps} />
};
