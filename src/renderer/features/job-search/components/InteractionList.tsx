import { Temporal } from "@js-temporal/polyfill";
import { GridColDef } from "@mui/x-data-grid";
import { JobSearchDbSchema, JobSearchInteractionTransfer } from "../../../../shared/features/job-search";
import { DataGrid, GridCellRenderer, useDataGrid } from "../../../shared/grid";
import { useJobSearchInteractionsIpc } from "../hooks";
import { InteractionSourceCellRenderer } from "./InteractionSourceCellRenderer";
import { InteractionTimePeriodCellRenderer } from "./InteractionTimePeriodCellRenderer";
import { useMemo } from "react";
import { GridRowHeightParams } from "@mui/x-data-grid";
import { InteractionDetail } from "./InteractionDetail";

type Row = JobSearchInteractionTransfer & {
  type: 'list' | 'detail';
};

type CellRenderer = GridCellRenderer<Row>;

const detailCellRendererFactory = (editingInteractionId?: string): CellRenderer => (params) => {
  const { id, type } = params.row;
  if (type !== 'detail') return <InteractionSourceCellRenderer {...params} />;
  return <div style={{ height: editingInteractionId === id ? 'auto' : 0 }}>
    <InteractionDetail interactionId={id} />;
  </div>;
};


// TODO: Can we icon these columns?
const getColumns = (interactionId?: string): GridColDef<Row>[] => {
  const columns: GridColDef<Row>[] = [
    {
      colSpan: (_, { type, timeperiod: { start } }) => {
        console.log('colSpan', type, start)
        if (type === 'detail') return 4;
        return 0;
      },
      field: 'source',
      headerName: 'Source',
      renderCell: detailCellRendererFactory(interactionId),
      width: 75,
    },
    {
      field: 'timeperiod', // Probably want a clock or calendar.
      headerName: 'Started',
      renderCell: InteractionTimePeriodCellRenderer,
    },
    {
      field: 'person',
      headerName: 'Person', // Person icon
      // Unidentified people should have a slight warning somehow. A person can be yellow, but maybe unidentified is orange.
      valueGetter: (_, { person }) => person ? `${person.name.substring(0, 11)}...` : '-',
    },
  ];
  const roleColumn: GridColDef<Row> = {
    field: 'application',
    headerName: 'Role',
    // Unspecified roles should be greyed or "ghosted".
    valueGetter: (_, { applications: [application] }) => application ? `${application.role.substring(0, 10)}...` : '-',
  };

  return [
    ...columns,
    roleColumn,
  ];
};

export const JobSearchInteractionList = ({
  applicationId,
  edit,
  editing,
}: {
  applicationId?: JobSearchDbSchema['id']['applications'];
  edit: (interactionId: JobSearchDbSchema['id']['interactions']) => void;
  editing?: string;
}) => {
  // const { interactions } = useJobSearchInteractionsIpc();
  const columns = useMemo(() => getColumns(editing), [editing]);
  // const rows = useMemo(() => {
  //   if (!interactions) return [];
  //   return [...interactions.values()].reduce((rows, interaction) => {
  //     return [
  //       ...rows,
  //       { ...interaction, type: 'list' },
  //       // { ...interaction, type: 'detail' },
  //     ];
  //   }, []);
  // }, [interactions]);
  const dataGridProps = useDataGrid({
    columns,
    // getRowHeight: (params: GridRowHeightParams) => {
    //   // const { type } = params.row;
    //   // if (type === 'detail') return 'auto';
    //   return 'auto';
    // },
    getRowId: ({ id, type }) => `${type}-${id}`,
    onRowClick: ({ row: { id } }) => edit(id),
    // rows: rows,
    rows: [],
    style: {
      // TODO: Hate it.
      minWidth: '40%',
    },
  });
  // if (!interactions) return <></>;
  return <>
    <DataGrid
      {...dataGridProps}
    />
  </>;
};
