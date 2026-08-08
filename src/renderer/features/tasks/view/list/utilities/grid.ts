console.log('renderer features tasks utilities list')

import { Task } from "@/shared/features/user-tasks";
import {
  BreadcrumbActiveNavigationItem,
  TaskListViewConfigName,
  TaskViewConfigName
} from "@/renderer/shared/navigation";
import {
  TaskComparisonFunction, TaskReducerFunction, TaskViewResponse
} from "../../../types";
import {
  compareAbstainedTasks,
  compareAwaitingTasks,
  compareImportantTasks,
  compareProposedTasks,
  compareQuickTasks
} from "../../../shared/utilities/comparison";
import {
  reduceAbstainedTasks,
  reduceActiveTasks,
  reduceAwaitingTasks,
  reduceProposedTasks
} from "../../../shared/utilities/view";
import { GridColDef } from "@mui/x-data-grid";

const mapping: Partial<Record<TaskViewConfigName, {
  comparison: TaskComparisonFunction;
  reducer: TaskReducerFunction;
}>> = {
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

const getTaskListFactory = (
  view: TaskViewConfigName,
) => {
  const fncs = mapping[view];
  if (!fncs) throw new Error(`Invalid view: ${view}`);
  const { comparison, reducer } = fncs;
  return (tasks: Task[]): Task[] => tasks
    .reduce(reducer, [])
    .sort(comparison);
};

export const getViewTaskFactory = (
  getTaskViewColumns: (view: TaskListViewConfigName) => GridColDef<Task>[]
) => (
  incomplete: Task[],
  view: BreadcrumbActiveNavigationItem | undefined,
  taskViewNames: string[],
): TaskViewResponse => {
    const base = { message: '', success: false };
    if (!view) return { ...base, message: 'No view specified' };
    if (!taskViewNames.includes(view.name)) return {
      ...base,
      message: `Invalid view: ${view.name} (${view.path}).`
    };

    const name = view.name as TaskViewConfigName;
    if (name === 'new') return { ...base, success: true };

    const getTaskList = getTaskListFactory(name);
    const columns = getTaskViewColumns(name);
    const data = getTaskList(incomplete);

    return { ...base, list: { columns, data }, success: true };
  }