import { TaskViewConfigName } from "../../../shared/navigation";
import { TASKS_VIEW_COLUMNS } from "../constants";
import { UiUserTask } from "../types";

const showStatusColumn = (
  view: TaskViewConfigName,
  column: keyof UiUserTask,
) => {
  if (view === 'proposed' && column === 'status') return false;
  return true;
};

const showColumnFactory = (view: TaskViewConfigName) => (
  columnName: string,
) => showStatusColumn(view, columnName as keyof UiUserTask);

export const getTaskViewColumns = (view: TaskViewConfigName) =>
  TASKS_VIEW_COLUMNS.filter(col => showColumnFactory(view)(col.field));
