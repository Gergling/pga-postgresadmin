import { VOTE_PROPS } from "../config";
import { TASK_IMPORTANCE_RANKS, TASK_MOMENTUM_RANKS } from "../constants";
import { TaskImportance, TaskMomentum, TaskRanks, TaskRanksMap, VotePropsName } from "../types";

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
  PropsName extends VotePropsName, // either "importance" or "momentum".
  RankMapping extends TaskRanksMap[PropsName], // will be the rank mapping from
    // either TASK_IMPORTANCE_RANKS, or TASK_MOMENTUM_RANKS
  Vote extends keyof RankMapping, // will be a non-abstained/awaiting vote value.
>(
  voteProp: PropsName,
  vote: Vote,
): number => {
  const ranks: RankMapping = taskRankMap[voteProp] as RankMapping;
  if (!ranks) throw new Error(`Unknown vote property: ${voteProp}`);
  if (!(vote in ranks)) throw new Error(`Unknown vote value for ${voteProp}: ${String(vote)}`);
  return ranks[vote];
};
