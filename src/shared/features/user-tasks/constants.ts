import { TASK_IMPORTANCE, TASK_MOMENTUM, TASK_VOTE_BASE, VOTE_PROPS } from "./config";
import { TaskImportance, TaskMomentum, TaskRanksMap, TaskVoteBase, VotePropsName } from "./types";

export const TASK_IMPORTANCE_RANKS = TASK_IMPORTANCE.reduce((acc, { name }, idx) => ({
  ...acc,
  [name]: idx - 1,
}), {} as TaskRanksMap['importance']);

export const TASK_MOMENTUM_RANKS = TASK_MOMENTUM.reduce((acc, { name }, idx) => ({
  ...acc,
  [name]: idx - 1,
}), {} as TaskRanksMap['momentum']);

export const TASK_VOTE_PROPS = Object.keys(VOTE_PROPS) as VotePropsName[];

export const TASK_IMPORTANCE_NAMES: TaskImportance[] = TASK_IMPORTANCE.map(({ name }) => name);

export const TASK_MOMENTUM_NAMES: TaskMomentum[] = TASK_MOMENTUM.map(({ name }) => name);

export const TASK_VOTE_BASE_NAMES: TaskVoteBase[] = TASK_VOTE_BASE.map(({ name }) => name);
