import { CouncilMemberNames, TaskVoteBase, VoteProps } from "./config";

export type VotePropsName = keyof VoteProps;
type VotePropsMap = {
  [K in VotePropsName]: VoteProps[K][number]['name'];
}
export type TaskRanksMap = {
  [K in VotePropsName]: Record<VotePropsMap[K], number>;
}
export type TaskRanks<PropsName extends VotePropsName> = TaskRanksMap[PropsName];
export type TaskVoteBaseNames = TaskVoteBase['name'];
export type TaskVoteBaseSummaryMap = {
  [K in TaskVoteBase as K['name']]: K['summary'];
};
export type TaskVoteBaseSummary = TaskVoteBase['summary'];

export type TaskImportance = VotePropsMap['importance'];
export type TaskMomentum = VotePropsMap['momentum'];

export type CouncilVotesBase = Record<CouncilMemberNames, TaskVoteBaseNames>;
export type CouncilVotes<T extends TaskImportance | TaskMomentum> = Record<CouncilMemberNames, T | TaskVoteBaseNames>;
export type CouncilVotesMap = {
  [K in VotePropsName]: CouncilVotes<VotePropsMap[K]>;
};
