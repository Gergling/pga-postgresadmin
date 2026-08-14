import { CouncilMemberNames, TaskVoteBase, VoteProps } from "./config";
/**
 * @deprecated Use the other one.
 */
export type VotePropsName = keyof VoteProps;
type VotePropsMap = {
  [K in VotePropsName]: VoteProps[K][number]['name'];
}
/**
 * @deprecated Use the other one.
 */
export type TaskRanksMap = {
  [K in VotePropsName]: Record<VotePropsMap[K], number>;
}
/**
 * @deprecated Use the other one.
 */
export type TaskRanks<PropsName extends VotePropsName> = TaskRanksMap[PropsName];
/**
 * @deprecated Use the other one.
 */
export type TaskVoteBaseNames = TaskVoteBase['name'];
/**
 * @deprecated Use the other one.
 */
export type TaskVoteBaseSummaryMap = {
  [K in TaskVoteBase as K['name']]: K['summary'];
};
/**
 * @deprecated Use the other one.
 */
export type TaskVoteBaseSummary = TaskVoteBase['summary'];
/**
 * @deprecated Use the other one.
 */
export type TaskImportance = VotePropsMap['importance'];
/**
 * @deprecated Use the other one.
 */
export type TaskMomentum = VotePropsMap['momentum'];

/**
 * @deprecated Use the other one.
 */
export type CouncilVotesBase = Record<CouncilMemberNames, TaskVoteBaseNames>;
/**
 * @deprecated Use the other one.
 */
export type CouncilVotes<T extends TaskImportance | TaskMomentum> = Record<CouncilMemberNames, T | TaskVoteBaseNames>;
/**
 * @deprecated Use the other one.
 */
export type CouncilVotesMap = {
  [K in VotePropsName]: CouncilVotes<VotePropsMap[K]>;
};
