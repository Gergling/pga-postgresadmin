import { DataGridProps, GridColDef } from "@mui/x-data-grid";
import {
  Task,
  WorkflowEventConfigItem
} from "@/shared/features/user-tasks";
import { GridCellRenderer } from "@/renderer/shared/grid";
import { UiNavigationConfigItem } from "@/renderer/shared/navigation";

export type TaskComparisonFunction = (a: Task, b: Task) => number;
export type TaskFilterFunction = (task: Task) => boolean;
export type TaskReducerFunction = (tasks: Task[], task: Task) => Task[];

export type TaskAction = WorkflowEventConfigItem & {
  action: () => void;
  name: string;
};

export type TaskViewResponse = {
  list?: {
    columns: GridColDef<Task>[];
    data: Task[];
  };
  message: string;
  success: boolean;
};

export type UseUserTaskResponse = {
  grid: DataGridProps<Task>;
  message: string;
  success: boolean;
};

export type TaskView = {
  icon: Required<UiNavigationConfigItem>['icon'];
  label: string;
  path: string;
};

export type CellRenderer = GridCellRenderer<Task>;
