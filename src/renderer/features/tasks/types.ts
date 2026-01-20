import { DataGridProps, GridColDef } from "@mui/x-data-grid";
import {
  TaskVoteSummary,
  UserTask,
  WorkflowEvent,
  WorkflowEventConfigItem
} from "../../../shared/features/user-tasks";
import { GridCellRenderer } from "../../shared/grid";

export type UiUserTask = UserTask & {
  scores: TaskVoteSummary;
  view: 'edge' | 'outdated' | 'transitioning';
};

export type TaskComparisonFunction = (a: UiUserTask, b: UiUserTask) => number;
export type TaskFilterFunction = (task: UiUserTask) => boolean;
export type TaskReducerFunction = (tasks: UiUserTask[], task: UserTask) => UiUserTask[];

export type TaskAction = WorkflowEventConfigItem & {
  action: () => void;
  name: WorkflowEvent;
};

export type TaskViewResponse = {
  columns: GridColDef<UiUserTask>[];
  data: UiUserTask[];
  message: string;
  success: boolean;
};

export type UseUserTaskResponse = {
  grid: DataGridProps<UiUserTask>;
  message: string;
  success: boolean;
};

export type CellRenderer = GridCellRenderer<UiUserTask>;
