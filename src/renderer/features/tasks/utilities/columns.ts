import { TaskViewConfigName } from "../../../shared/navigation";
import { TASK_VIEW_COLUMN_SCORE_LABELS, TASKS_VIEW_COLUMNS } from "../constants";
import { UiUserTask } from "../types";

const showStatusColumn = (
  view: TaskViewConfigName,
  column: keyof UiUserTask,
) => {
  if (view === 'proposed' && ['status', 'votes'].includes(column)) return false;
  return true;
};

const showColumnFactory = (view: TaskViewConfigName) => (
  columnName: string,
) => showStatusColumn(view, columnName as keyof UiUserTask);

export const getTaskViewColumns = (view: TaskViewConfigName) => TASKS_VIEW_COLUMNS
  .map(
    (col) => col.field === 'scores'
      ? { ...col, headerName: TASK_VIEW_COLUMN_SCORE_LABELS[view] }
      : col
  )
  .filter(col => showColumnFactory(view)(col.field));
