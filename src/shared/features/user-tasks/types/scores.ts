import { CouncilMemberNames } from "./config";
import {
  TaskImportance,
  TaskMomentum,
  TaskVoteBaseSummary,
  VotePropsName
} from "./votes";

// Atomic
export type AtomicVoteValueMap = {
  importance: TaskImportance;
  momentum: TaskMomentum;
};
export type AtomicVoteValueSummary = TaskVoteBaseSummary | number;
export type AtomicVoteValue<T extends VotePropsName> = {
  echo: boolean;
  rank: number | undefined; // Will be undefined if vote is indecisive and
    // echo is undefined. Should appear "ghosted" if vote is indecisive but echo is not.
  summary: AtomicVoteValueSummary;
  voteProp: T;
};

export type AtomicVote<T extends VotePropsName = VotePropsName> = {
  member: CouncilMemberNames;
} & AtomicVoteValue<T>;

// Councillor
export type CouncilMemberAtomisedVotes = {
  [K in VotePropsName]: AtomicVoteValue<K>;
};

export type CouncilMemberVoteValue = {
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

// Summary
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
