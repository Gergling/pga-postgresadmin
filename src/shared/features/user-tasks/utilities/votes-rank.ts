import { TASK_IMPORTANCE_RANKS, TASK_MOMENTUM_RANKS } from "../constants";
import { TaskRanks, TaskRanksMap, VotePropsName } from "../types";

const taskRankMap: TaskRanksMap = {
  importance: TASK_IMPORTANCE_RANKS,
  momentum: TASK_MOMENTUM_RANKS,
};

export const getRankMapping = <
  PropsName extends VotePropsName, // either "importance" or "momentum".
>(
  voteProp: PropsName,
): TaskRanks<PropsName> => taskRankMap[voteProp];

export const getVoteRank = <
  PropsName extends VotePropsName,
  Vote extends keyof TaskRanks<PropsName>, // will be a non-abstained/awaiting vote value.
>(
  voteProp: PropsName,
  vote: Vote,
): number => {
  const ranks = getRankMapping(voteProp);
  return ranks[vote];
};
