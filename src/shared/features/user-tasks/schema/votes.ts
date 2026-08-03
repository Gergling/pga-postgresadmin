import z from "zod";
import {
  COUNCIL_MEMBER,
  CouncilMemberNames,
  councilMemberNamesSchema,
  taskImportanceSchema,
  taskMomentumSchema,
  TaskVoteBaseNames,
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
