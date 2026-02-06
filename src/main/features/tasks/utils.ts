import { DeepPartial, Optional, Swap } from "../../../shared/types";
import {
  COUNCIL_MEMBER,
  CouncilMemberNames,
  CouncilVotes,
  TaskImportance,
  TaskMomentum,
  TaskVoteBaseNames,
} from "../../../shared/features/user-tasks";
import { UserTaskDb } from "./types";

type InitialVoteState = Record<CouncilMemberNames, Exclude<TaskVoteBaseNames, 'Abstained'>>;
const createInitialVotes = <T extends TaskImportance | TaskMomentum>(
  state: DeepPartial<CouncilVotes<T>> = {} as InitialVoteState
): CouncilVotes<T> => COUNCIL_MEMBER.reduce((acc, { id }) => ({
  ...acc,
  [id]: acc[id] || 'Awaiting',
}), state as CouncilVotes<T>);

// If an id goes in, an id should come out.
// So the input type is essentially either ComplicatedPartial<UserTaskWithId | UserTaskWithoutId>
// The output type is essentially either UserTaskWithId | UserTaskWithoutId.
type CreateUserTaskProps = Optional<
  Swap<
    UserTaskDb,
    'votes',
    DeepPartial<UserTaskDb['votes']>
  >,
  'audit' | 'updated' | 'source' | 'status' | 'relationships'
>;

export const createUserTaskWithoutId = (
  task: Omit<CreateUserTaskProps, 'id'>
): Omit<UserTaskDb, 'id'> => {
  return {
    audit: [],
    relationships: {
      children: [],
      predecessors: [],
      successors: [],
    },
    source: { type: 'manual' },
    status: 'proposed',
    updated: Date.now(),
    ...task,
    votes: {
      momentum: createInitialVotes(task.votes?.momentum),
      importance: createInitialVotes(task.votes?.importance),
    },
  };
};
export const createUserTask = (
  task: CreateUserTaskProps
): UserTaskDb => {
  return {
    ...createUserTaskWithoutId(task),
    id: task.id,
  };
};

// This is a "safety catch" for when types change without migration.
export const updateUserTask = (
  task: UserTaskDb
): UserTaskDb => {
  return {
    ...createUserTaskWithoutId(task),
    ...task,
  };
};
