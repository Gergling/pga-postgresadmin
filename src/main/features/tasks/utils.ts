import { Optional } from "../../../shared/types";
import {
  COUNCIL_MEMBER_NAMES,
  CouncilMemberNames,
  CouncilVotes,
  TaskImportance,
  TaskMomentum,
  TaskVoteBase,
  UserTask
} from "../../../shared/features/user-tasks";

type InitialVoteState = Record<CouncilMemberNames, Exclude<TaskVoteBase, 'Abstained'>>;
const createInitialVotes = <T extends TaskImportance | TaskMomentum>(
  state: CouncilVotes<T> = {} as InitialVoteState
): CouncilVotes<T> => COUNCIL_MEMBER_NAMES.reduce((acc, name) => ({
  ...acc,
  [name]: acc[name] || 'Awaiting',
}), state);

export const createUserTask = (task: Optional<
  UserTask,
  'audit' | 'updated' | 'source' | 'status'
>): UserTask => ({
  status: 'proposed',
  source: 'manual',
  updated: Date.now(),
  audit: [],
  ...task,
  votes: {
    momentum: createInitialVotes(task.votes.momentum),
    importance: createInitialVotes(task.votes.importance),
  },
});
