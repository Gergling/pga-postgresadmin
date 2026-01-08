import { TaskViewConfigName } from "../../../shared/navigation";
import { UserTask } from "../../../../shared/features/user-tasks";
import { TaskComparisonFunction, TaskReducerFunction, UiUserTask } from "../types";
import {
  compareAbstainedTasks,
  compareAwaitingTasks,
  compareImportantTasks,
  compareProposedTasks,
  compareQuickTasks
} from "./comparison";
import { reduceAbstainedTasks, reduceActiveTasks, reduceAwaitingTasks, reduceProposedTasks } from "./reducer";

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
) => (
  tasks: UserTask[],
): UiUserTask[] => {
  const fncs = mapping[view];

  console.log('getTaskListFactory', view, mapping, fncs)
  if (!fncs) throw new Error(`Invalid view: ${view}`);

  const { comparison, reducer } = fncs;
  return tasks
    .reduce(reducer, [])
    .sort(comparison);
};
