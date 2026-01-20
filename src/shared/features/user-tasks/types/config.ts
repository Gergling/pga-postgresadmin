import { COUNCIL_MEMBER, TASK_VOTE_BASE, VOTE_PROPS } from "../config";

export type VoteProps = typeof VOTE_PROPS;
export type TaskVoteBase = typeof TASK_VOTE_BASE[number];
export type CouncilMemberNames = (typeof COUNCIL_MEMBER[number])['id'];
