import { COUNCIL_MEMBER } from "../config";
import { TASK_VOTE_BASE_SUMMARY_MAP, TASK_VOTE_PROPS } from "../constants";
import {
  AtomicVote,
  AtomicVoteValueMap,
  AtomicVoteValueSummary,
  CouncilMemberNames,
  TaskVoteBase,
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

export const getAtomicSummary = <
  T extends VotePropsName, // "importance"/"momentum"
  U extends AtomicVoteValueMap[T] 
>(
  rank: number | undefined,
  echo: AtomicVoteValueMap[T] | undefined,
  vote: U | TaskVoteBase,
  voteProp: T
): AtomicVoteValueSummary => {
  if (rank !== undefined) return rank;
  if (echo !== undefined) return getVoteRank(voteProp, echo);
  return TASK_VOTE_BASE_SUMMARY_MAP[vote as TaskVoteBase];
};

export const getAtomicVote = <
  T extends VotePropsName, // "importance"/"momentum"
  U extends AtomicVoteValueMap[T] 
>(
  task: UserTask,
  member: CouncilMemberNames,
  voteProp: T
): AtomicVote<T> => {
  const vote: U | TaskVoteBase = task.votes[voteProp][member] as U | TaskVoteBase;
  const echo = getEchoVote(task, member, voteProp);
  const rank = vote === 'Awaiting' || vote === 'Abstained'
    ? undefined
    : getVoteRank(voteProp, vote);
  const summary = getAtomicSummary(rank, echo, vote, voteProp);
  return {
    echo: echo !== undefined,
    member,
    rank,
    summary,
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
