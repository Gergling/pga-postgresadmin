import { GridColDef } from '@mui/x-data-grid';
import { UiUserTask } from "../types";
import {
  TaskScoreCellRenderer,
  TaskSourceCellRenderer,
  TaskStatusCellRenderer,
  TaskStatusControlCellRenderer,
  TaskUpdatedCellRenderer,
  TaskVotesCellRenderer
} from '../components';

export const TASKS_VIEW_COLUMNS: GridColDef<UiUserTask>[] = [
  {
    // If this is going to be editable, make sure the changes go through the proper process.
    // Ideally, this takes up a larger portion of the screen
    field: 'summary',
    headerName: 'Summary',
    editable: true,
    width: 300,
  },
  {
    field: 'status',
    headerName: 'Status',
    renderCell: TaskStatusCellRenderer,
    width: 125,
  },
  {
    field: 'source',
    headerName: 'Source',
    renderCell: TaskSourceCellRenderer,
    width: 75,
  },
  {
    // Could do with more time related data, e.g. an age, etc.
    field: 'updated',
    headerName: 'Last Updated',
    renderCell: TaskUpdatedCellRenderer,
    width: 150,
  },
  {
    field: 'votes',
    headerName: 'Votes',
    renderCell: TaskVotesCellRenderer,
    width: 75,
  },
  {
    field: 'scores',
    renderCell: TaskScoreCellRenderer,
    headerName: 'Score',
  },
  {
    field: 'actions',
    headerName: 'Actions',
    renderCell: TaskStatusControlCellRenderer,
    width: 125,
  },
  // There should be a check/cross column for controlling when proposed tasks
  // are completed.
  // Probably we want a lot of specialised controls regarding the status. Make
  // a FSM table and/or diagram to understand all these.
];