import { getVoteScores, UserTask } from "../../../../shared/features/user-tasks";
import { TaskReducerFunction, UiUserTask } from "../types";

const isProposedTask = ({ status }: UiUserTask) => status === 'proposed';
const isNotProposedTask = ({ status }: UiUserTask) => status !== 'proposed';
const hasAbstainedVotes = ({ scores }: UiUserTask) => scores.abstained > 0;
const hasAwaitingVotes = ({ scores }: UiUserTask) => scores.awaiting > 0;

const createUiUserTask = (task: UserTask): UiUserTask => {
  const scores = getVoteScores(task);
  return {
    ...task,
    scores,
  };
};

export const reduceProposedTasks: TaskReducerFunction = (tasks, baseTask) => {
  const task = createUiUserTask(baseTask);
  if (isProposedTask(task)) return [...tasks, task];
  return tasks;
};

export const reduceActiveTasks: TaskReducerFunction = (tasks, baseTask) => {
  const task = createUiUserTask(baseTask);
  if (isNotProposedTask(task)) return [...tasks, task];
  return tasks;
};

export const reduceAbstainedTasks: TaskReducerFunction = (tasks, baseTask) => {
  const task = createUiUserTask(baseTask);
  if (hasAbstainedVotes(task)) return [...tasks, task];
  return tasks;
};

export const reduceAwaitingTasks: TaskReducerFunction = (tasks, baseTask) => {
  const task = createUiUserTask(baseTask);
  if (hasAwaitingVotes(task)) return [...tasks, task];
  return tasks;
};
