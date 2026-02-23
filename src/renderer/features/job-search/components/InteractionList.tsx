import { GridColDef } from "@mui/x-data-grid";
import { JobSearchArchetype } from "../../../../shared/features/job-search";
import { DataGrid, useDataGrid } from "../../../shared/grid";
import { useJobSearchInteractionsIpc } from "../hooks";
import { InteractionSourceCellRenderer } from "./InteractionSourceCellRenderer";

// TODO: Can we icon these columns?
const columns: GridColDef<JobSearchArchetype['base']['interactions']>[] = [
  {
    field: 'source',
    headerName: 'Source',
    renderCell: InteractionSourceCellRenderer,
    width: 75,
  },
  {
    field: 'timeperiod', // Probably want a clock or calendar.
    headerName: 'Started',
    valueGetter: (_, { timeperiod: { start } }) => start,
  },
  {
    field: 'person',
    headerName: 'Person', // Person icon
    // Unidentified people should have a slight warning somehow. A person can be yellow, but maybe unidentified is orange.
    valueGetter: (_, { person }) => person ? `${person.name.substring(0, 11)}...` : '(Unidentified)',
  },
  {
    field: 'application',
    headerName: 'Role',
    // Unspecified roles should be greyed or "ghosted".
    valueGetter: (_, { application }) => application ? `${application.role.substring(0, 10)}...` : '(Unspecified)',
  },
];

export const JobSearchInteractionList = ({ edit }: { edit: (interactionId: string) => void; }) => {
  const { interactions } = useJobSearchInteractionsIpc();
  const dataGridProps = useDataGrid({
    columns,
    onRowClick: ({ row: { id } }) => edit(id),
    rows: interactions ? [...interactions.values()] : [],
  });
  if (!interactions) return <></>;
  return <>
    <DataGrid
      {...dataGridProps}
    />
  </>;
};
