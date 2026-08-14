import z from "zod";
import {
  COUNCIL_MEMBER,
  CouncilMemberNames,
  TaskImportance,
  taskImportanceSchema,
  TaskMomentum,
  taskMomentumSchema,
  TaskVoteBaseSummary,
  taskVoteBaseSummarySchema,
  VOTE_PROPS,
  VotePropsName,
  votePropsNameSchema
} from "./config";

// Atomic
export const atomicVoteValueMapSchema = z.object({
  [votePropsNameSchema.enum.importance]: taskImportanceSchema,
  [votePropsNameSchema.enum.momentum]: taskMomentumSchema,
});
export type AtomicVoteValueMap = z.infer<typeof atomicVoteValueMapSchema>;

const atomicVoteValueSummarySchema = z.union([taskVoteBaseSummarySchema, z.number()]);
export type AtomicVoteValueSummary = z.infer<typeof atomicVoteValueSummarySchema>;
const atomicVoteValueBaseSchema = z.object({
  echo: z.boolean(),
  rank: z.number().optional(),
  summary: atomicVoteValueSummarySchema,
});

const atomicVoteValueSchemaFactory = <T extends VotePropsName>(
  voteProp: T
) => atomicVoteValueBaseSchema.extend({
  voteProp: z.literal(voteProp),
});
export type AtomicVoteValue<T extends VotePropsName> = z.infer<
  ReturnType<typeof atomicVoteValueSchemaFactory<T>>
>;

const atomicVoteFactory = <T extends VotePropsName>(
  voteProp: T,
  member: CouncilMemberNames,
) => atomicVoteValueSchemaFactory<T>(voteProp).extend({
  member: z.literal(member),
});

const x = votePropsNameSchema.options.reduce(
  (acc, voteProp) => [
    ...acc,
    ...COUNCIL_MEMBER.map(({ name }) => atomicVoteFactory(
      voteProp,
      name,
    )),
  ],
  [],
);

export type AtomicVote<T extends VotePropsName = VotePropsName> = z.infer<
  ReturnType<typeof atomicVoteFactory<T>>
>;

// Councillor
export type CouncilMemberAtomisedVotes = {
  [K in VotePropsName]: AtomicVoteValue<K>;
};

const councilMemberAtomisedVotes = z.object(
  Object.keys(VOTE_PROPS).reduce((acc, dimension) => {
    return {
      ...acc,
      [dimension]: atomicVoteValueSchemaFactory(dimension as VotePropsName),
    };
  }, {} as CouncilMemberAtomisedVotes)
);

export type CouncilMemberVoteValue = {
  awaiting: number;
  echoes: boolean[];
  values: AtomicVoteValueSummary[];
};

export type TaskVoteValues = {
  importance?: number; // 
  mean?: number;
  momentum?: number;
};

export type TaskVotes = TaskVoteValues & {
  abstained: number;
  awaiting: number;
  echoes: number;
};

export type CouncilMemberVotes = {
  atomised: CouncilMemberAtomisedVotes;
  member: CouncilMemberNames;
  summary: CouncilMemberVoteValue;
};

export type TaskVoteSummary = {
  atomic: AtomicVote[];
  council: {
    list: CouncilMemberVotes[];
    map: {
      [K in CouncilMemberNames]: CouncilMemberVotes;
    };
  };
  task: TaskVotes;
};
