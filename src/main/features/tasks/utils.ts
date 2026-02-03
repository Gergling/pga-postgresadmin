import { DeepPartial, Optional, Swap } from "../../../shared/types";
import {
  COUNCIL_MEMBER,
  CouncilMemberNames,
  CouncilVotes,
  // createMemberVotes,
  TaskImportance,
  TaskMomentum,
  TaskVoteBaseNames,
  UserTask
} from "../../../shared/features/user-tasks";

type InitialVoteState = Record<CouncilMemberNames, Exclude<TaskVoteBaseNames, 'Abstained'>>;
const createInitialVotes = <T extends TaskImportance | TaskMomentum>(
  state: DeepPartial<CouncilVotes<T>> = {} as InitialVoteState
): CouncilVotes<T> => COUNCIL_MEMBER.reduce((acc, { id }) => ({
  ...acc,
  [id]: acc[id] || 'Awaiting',
}), state as CouncilVotes<T>);

export const createUserTask = (task: Optional<
  Swap<
    UserTask,
    'votes',
    DeepPartial<UserTask['votes']>
  >,
  'audit' | 'updated' | 'source' | 'status'
>): UserTask => {
  return {
    status: 'proposed',
    source: { type: 'manual' },
    updated: Date.now(),
    audit: [],
    ...task,
    votes: {
      momentum: createInitialVotes(task.votes?.momentum),
      importance: createInitialVotes(task.votes?.importance),
    },
  };
};
