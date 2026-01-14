import { COUNCIL_MEMBER } from "../config";
import { TASK_VOTE_PROPS } from "../constants";
import {
  AtomicVote,
  AtomicVoteValueMap,
  CouncilMemberNames,
  UserTask,
  VotePropsName
} from "../types";
import { getVoteRank } from "./votes-rank";

// Get the last non-awaiting vote for this task and council member.
// This is only worth calling for tasks which are abstained/awaiting.
// This is much easier if the task audits are reduced down to the partial types.
export const getEchoVote = <
  T extends VotePropsName,
  U extends AtomicVoteValueMap[T]
>(
  { audit }: UserTask,
  member: CouncilMemberNames,
  voteProp: T
): U | undefined => {
  for (const { votes } of audit) {
    if (!votes) continue;
    const vote = votes[voteProp][member];
    if (vote !== 'Awaiting') return vote as U;
  }
};

export const getAtomicVote = <
  T extends VotePropsName, // "importance"/"momentum"
  U extends AtomicVoteValueMap[T] 
>(
  task: UserTask,
  member: CouncilMemberNames,
  voteProp: T
): AtomicVote<T> => {
  const vote: U = task.votes[voteProp][member] as U;
  const echo = getEchoVote(task, member, voteProp);
  const rank = getVoteRank(voteProp, vote);
  return {
    echo,
    member,
    rank,
    vote,
    voteProp,
  };
};

export const atomiseVotes = (
  task: UserTask,
): AtomicVote[] => TASK_VOTE_PROPS.reduce(
  (acc, voteProp) => COUNCIL_MEMBER.reduce(
    (acc, { id: member }): AtomicVote[] => [
      ...acc,
      getAtomicVote(task, member, voteProp),
    ],
    acc
  ),
  []
);
