import { DataGridProps, GridColDef } from "@mui/x-data-grid";
import {
  TaskRelationshipBase,
  TaskVoteSummary,
  UserTask,
  UserTaskAudit,
  WorkflowEvent,
  WorkflowEventConfigItem
} from "../../../shared/features/user-tasks";
import { GridCellRenderer } from "../../shared/grid";
import { UiNavigationConfigItem } from "../../shared/navigation";

export type UiUserTask<T extends boolean = false> =
  & Omit<UserTask, 'id'>
  & Pick<T extends true ? Required<UserTask> : UserTask, 'id'>
  & {
    audit: UserTaskAudit<UiUserTask>[];
    relationships: TaskRelationshipBase<UiUserTask<T>>;
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

export type TaskView = {
  icon: Required<UiNavigationConfigItem>['icon'];
  label: string;
  path: string;
};

export type CellRenderer = GridCellRenderer<UiUserTask>;
