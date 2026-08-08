import { TaskListViewConfigName } from "@/renderer/shared/navigation";
import { Task, TaskCore } from "@/shared/features/user-tasks";
import { TaskListViewColumnScoreLabels } from "../config";
import { GridColDef } from "@mui/x-data-grid";

const showStatusColumn = (
  view: TaskListViewConfigName,
  column: keyof TaskCore,
) => {
  if (view === 'proposed' && ['status', 'votes'].includes(column)) return false;
  return true;
};

const showColumnFactory = (view: TaskListViewConfigName) => (
  columnName: string,
) => showStatusColumn(view, columnName as keyof TaskCore);

export const getTaskViewColumnsFactory = (
  scoreLabels: TaskListViewColumnScoreLabels,
  tasksViewColumns: GridColDef<Task>[]
) => (view: TaskListViewConfigName) => {
  const showColumn = showColumnFactory(view);
  return tasksViewColumns
    .map(
      (col) => col.field === 'scores'
        ? { ...col, headerName: scoreLabels[view] }
        : col
    )
    .filter(col => showColumn(col.field));
}
