import { BreadcrumbActiveNavigationItem, TaskViewConfigName } from "../../../shared/navigation";
import { UserTask } from "../../../../shared/features/user-tasks";
import { TaskComparisonFunction, TaskReducerFunction, TaskViewResponse, UiUserTask } from "../types";
import { getTaskViewColumns } from "./columns";
import {
  compareAbstainedTasks,
  compareAwaitingTasks,
  compareImportantTasks,
  compareProposedTasks,
  compareQuickTasks
} from "./comparison";
import {
  reduceAbstainedTasks,
  reduceActiveTasks,
  reduceAwaitingTasks,
  reduceProposedTasks
} from "./view";

const mapping: Record<TaskViewConfigName, {
  comparison: TaskComparisonFunction;
  reducer: TaskReducerFunction;
}> = {
  proposed: {
    comparison: compareProposedTasks,
    reducer: reduceProposedTasks,
  },
  quick: {
    comparison: compareQuickTasks,
    reducer: reduceActiveTasks,
  },
  important: {
    comparison: compareImportantTasks,
    reducer: reduceActiveTasks,
  },
  abstained: {
    comparison: compareAbstainedTasks,
    reducer: reduceAbstainedTasks,
  },
  awaiting: {
    comparison: compareAwaitingTasks,
    reducer: reduceAwaitingTasks,
  },
};

export const getTaskListFactory = (
  view: TaskViewConfigName,
) => {
  const fncs = mapping[view];
  if (!fncs) throw new Error(`Invalid view: ${view}`);
  const { comparison, reducer } = fncs;
  return (tasks: UserTask[]): UiUserTask[] => tasks
    .reduce(reducer, [])
    .sort(comparison);
};

export const getViewTasks = (
  incomplete: UserTask[],
  view: BreadcrumbActiveNavigationItem | undefined,
  taskViewNames: string[],
): TaskViewResponse => {
  const base = { columns: [], data: [], message: '', success: false };
  if (!view) return { ...base, message: 'No view specified' };
  if (!taskViewNames.includes(view.name)) return { ...base, message: `Invalid view: ${view.name} (${view.path}).` };

  const name = view.name as TaskViewConfigName;
  const getTaskList = getTaskListFactory(name);
  const columns = getTaskViewColumns(name);
  const data = getTaskList(incomplete);

  return { ...base, columns, data, success: true };
}