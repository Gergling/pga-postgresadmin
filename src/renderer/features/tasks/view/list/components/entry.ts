import { GridColDef } from '@mui/x-data-grid';
import { Task } from '@/shared/features/user-tasks';
import { TASK_VIEW_COLUMN_SCORE_LABELS } from '../config';
import { getTaskViewColumnsFactory, getViewTaskFactory } from '../utilities';
import { TaskScoreCellRenderer } from './ScoreCellRenderer';
import { TaskSourceCellRenderer } from './SourceCellRenderer';
import { TaskStatusCellRenderer } from './StatusCellRenderer';
import { TaskStatusControlCellRenderer } from './StatusControlCellRenderer';
import { TaskUpdatedCellRenderer } from './UpdatedCellRenderer';
import { TaskVotesCellRenderer } from './VotesCellRenderer';

export const TASKS_VIEW_COLUMNS: GridColDef<Task>[] = [
  {
    // If this is going to be editable, make sure the changes go through the proper process.
    // Ideally, this takes up a larger portion of the screen
    field: 'envelope.data.summary',
    valueGetter: (value, row) => row.envelope.data.summary,
    headerName: 'Summary',
    editable: true,
    width: 300,
  },
  {
    field: 'envelope.data.status',
    headerName: 'Status',
    renderCell: TaskStatusCellRenderer,
    width: 125,
  },
  {
    field: 'envelope.data.source',
    headerName: 'Source',
    renderCell: TaskSourceCellRenderer,
    width: 75,
  },
  {
    // Could do with more time related data, e.g. an age, etc.
    field: 'envelope.audit',
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
];

export const getTaskViewColumns = getTaskViewColumnsFactory(
  TASK_VIEW_COLUMN_SCORE_LABELS, TASKS_VIEW_COLUMNS
);
export const getViewTasks = getViewTaskFactory(getTaskViewColumns);
