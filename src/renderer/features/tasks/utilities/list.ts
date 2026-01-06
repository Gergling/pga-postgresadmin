import { UserTask } from "../../../../shared/features/user-tasks";
import { TaskViewConfigName } from "../../../shared/navigation/config/tasks";
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
  const { comparison, reducer } = mapping[view];
  return tasks
    .reduce(reducer, [])
    .sort(comparison);
};
