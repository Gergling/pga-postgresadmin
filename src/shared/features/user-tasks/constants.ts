import { TASK_IMPORTANCE, TASK_MOMENTUM, TASK_VOTE_BASE, VOTE_PROPS } from "./config";
import { TaskImportance, TaskMomentum, TaskRanksMap, TaskVoteBase, VotePropsName, WorkflowFsm } from "./types";

export const {
  TASK_IMPORTANCE_RANKS,
  TASK_IMPORTANCE_RANKS_MAXIMUM,
  TASK_IMPORTANCE_RANKS_MINIMUM,
} = TASK_IMPORTANCE.reduce(
  (acc, { name }, idx) => {
    const rank = idx - 1;
    return {
      ...acc,
      TASK_IMPORTANCE_RANKS: { ...acc.TASK_IMPORTANCE_RANKS, [name]: rank },
      TASK_IMPORTANCE_RANKS_MINIMUM: Math.min(acc.TASK_IMPORTANCE_RANKS_MINIMUM, rank),
      TASK_IMPORTANCE_RANKS_MAXIMUM: Math.max(acc.TASK_IMPORTANCE_RANKS_MAXIMUM, rank),
    };
  },
  {
    TASK_IMPORTANCE_RANKS_MINIMUM: Number.MAX_SAFE_INTEGER,
    TASK_IMPORTANCE_RANKS_MAXIMUM: -Number.MAX_SAFE_INTEGER,
  } as {
    TASK_IMPORTANCE_RANKS: TaskRanksMap['importance'];
    TASK_IMPORTANCE_RANKS_MINIMUM: number;
    TASK_IMPORTANCE_RANKS_MAXIMUM: number;
  }
);

export const {
  TASK_MOMENTUM_RANKS,
  TASK_MOMENTUM_RANKS_MAXIMUM,
  TASK_MOMENTUM_RANKS_MINIMUM,
} = TASK_MOMENTUM.reduce(
  (acc, { name }, idx) => {
    const rank = idx - 1;
    return {
      ...acc,
      TASK_MOMENTUM_RANKS: { ...acc.TASK_MOMENTUM_RANKS, [name]: rank },
      TASK_MOMENTUM_RANKS_MINIMUM: Math.min(acc.TASK_MOMENTUM_RANKS_MINIMUM, rank),
      TASK_MOMENTUM_RANKS_MAXIMUM: Math.max(acc.TASK_MOMENTUM_RANKS_MAXIMUM, rank),
    };
  },
  {
    TASK_MOMENTUM_RANKS_MINIMUM: Number.MAX_SAFE_INTEGER,
    TASK_MOMENTUM_RANKS_MAXIMUM: -Number.MAX_SAFE_INTEGER,
  } as {
    TASK_MOMENTUM_RANKS: TaskRanksMap['momentum'];
    TASK_MOMENTUM_RANKS_MINIMUM: number;
    TASK_MOMENTUM_RANKS_MAXIMUM: number;
  }
);

export const TASK_VOTE_PROPS = Object.keys(VOTE_PROPS) as VotePropsName[];

export const TASK_IMPORTANCE_NAMES: TaskImportance[] = TASK_IMPORTANCE.map(({ name }) => name);

export const TASK_MOMENTUM_NAMES: TaskMomentum[] = TASK_MOMENTUM.map(({ name }) => name);

export const TASK_VOTE_BASE_NAMES: TaskVoteBase[] = TASK_VOTE_BASE.map(({ name }) => name);

export const TASK_FSM: WorkflowFsm = {
  proposed: {
    approve: 'todo',
    dismiss: 'rejected',
  },
  todo: {
    start: 'doing',
    dismiss: 'rejected',
    finalize: 'done',
  },
  doing: {
    pause: 'todo',
    finalize: 'done',
  },
};
