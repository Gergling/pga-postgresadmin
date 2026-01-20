import { getVoteSummary, UserTask } from "../../../../shared/features/user-tasks";
import { TaskFilterFunction, TaskReducerFunction, UiUserTask } from "../types";

const hasAbstainedVotes: TaskFilterFunction = ({ scores }) => scores.task.abstained > 0;
const hasAwaitingVotes: TaskFilterFunction = ({ scores }) => scores.task.awaiting > 0;
const isNotEdgeTask: TaskFilterFunction = ({ view }) => view !== 'edge';
const isNotProposedTask: TaskFilterFunction = ({ status }) => status !== 'proposed';
const isProposedTask: TaskFilterFunction = ({ status }) => status === 'proposed';

const createUiUserTask = (task: UserTask & { view?: UiUserTask['view']; }): UiUserTask => {
  const scores = getVoteSummary(task);
  
  return {
    ...task,
    scores,
    view: task.view || 'edge',
  };
};

const reduceTasksFactory = (
  filter: TaskFilterFunction
): TaskReducerFunction => (tasks: UiUserTask[], baseTask: UserTask) => {
  const task = createUiUserTask(baseTask);
  if (isNotEdgeTask(task) || filter(task)) return [...tasks, task];
  return tasks;
};

export const reduceAbstainedTasks = reduceTasksFactory(hasAbstainedVotes);

// Useful for both "quick" and "important" tasks, which are from the same list,
// but sorted differently in a separate function we don't worry about here.
export const reduceActiveTasks = reduceTasksFactory(isNotProposedTask);

export const reduceAwaitingTasks = reduceTasksFactory(hasAwaitingVotes);

export const reduceProposedTasks = reduceTasksFactory(isProposedTask);
