import z from "zod";
import {
  COUNCIL_MEMBER,
  CouncilMemberNames,
  councilMemberNamesSchema,
  TaskImportance,
  taskImportanceSchema,
  TaskMomentum,
  taskMomentumSchema,
  TaskVoteBaseNames,
  VoteProps,
  VotePropsName,
} from "./config";

export type CouncilVotesBase = Record<CouncilMemberNames, TaskVoteBaseNames>;

const initialVotes = Object.fromEntries(COUNCIL_MEMBER.map(member => [
  member.name, 'Awaiting'
])) as Record<
  CouncilMemberNames, 'Awaiting'
>;

export const councilVotesMapSchema = z.object({
  importance: z.record(
    councilMemberNamesSchema, taskImportanceSchema.catch('Awaiting')
  ),
  momentum: z.record(
    councilMemberNamesSchema, taskMomentumSchema.catch('Awaiting')
  ),
}).catch(() => ({
  importance: initialVotes,
  momentum: initialVotes,
}));
export type CouncilVotesMap = z.infer<typeof councilVotesMapSchema>;

type VotePropsMap = {
  [K in VotePropsName]: VoteProps[K][number]['name'];
}
export type TaskRanksMap = {
  [K in VotePropsName]: Record<VotePropsMap[K], number>;
}
export type TaskRanks<PropsName extends VotePropsName> = TaskRanksMap[PropsName];

export type CouncilVotes<T extends TaskImportance | TaskMomentum> = Record<CouncilMemberNames, T | TaskVoteBaseNames>;

