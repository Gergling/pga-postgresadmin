import { COUNCIL_MEMBER, TASK_VOTE_BASE, VOTE_PROPS } from "./config";
import { SvgIconComponent } from "@mui/icons-material";

export type WorkflowState =
  | 'proposed' // A bot has created this task.
  | 'todo'
  | 'doing'
  | 'done'
  | 'rejected'
;

export type WorkflowEvent =
  | 'approve'
  | 'dismiss'
  | 'finalize'
  | 'pause'
  | 'start'
;
export type WorkflowEventConfigItem = {
  color: string;
  icon: SvgIconComponent;
  label: string;
};
export type WorkflowEventConfig = Record<WorkflowEvent, WorkflowEventConfigItem>;
export type WorkflowFsm = Partial<Record<WorkflowState, Partial<Record<WorkflowEvent, WorkflowState>>>>;

type VoteProps = typeof VOTE_PROPS;
export type VotePropsName = keyof VoteProps;
type VotePropsMap = {
  [K in VotePropsName]: VoteProps[K][number]['name'];
}
export type TaskRanksMap = {
  [K in VotePropsName]: Record<VotePropsMap[K], number>;
}
export type TaskRanks<PropsName extends VotePropsName> = TaskRanksMap[PropsName];
export type TaskVoteBase = (typeof TASK_VOTE_BASE[number])['name'];
export type TaskVoteBaseNames = (typeof TASK_VOTE_BASE[number])['name'];
export type TaskVoteBaseSummaryMap = {
  [K in typeof TASK_VOTE_BASE[number] as K['name']]: K['summary'];
};
export type TaskVoteBaseSummary = (typeof TASK_VOTE_BASE[number])['summary'];
export type TaskImportance = VotePropsMap['importance'];
export type TaskMomentum = VotePropsMap['momentum'];
type TaskSource = 'manual' | 'email';

export type CouncilMemberNames = (typeof COUNCIL_MEMBER[number])['id'];

export type CouncilVotes<T extends TaskImportance | TaskMomentum> = Record<CouncilMemberNames, T | TaskVoteBase>;
type CouncilVotesMap = {
  [K in VotePropsName]: CouncilVotes<VotePropsMap[K]>;
};

// Audit log for immutability patterns.
// Some properties should never be changed and therefore don't need to
// feature in the audit. The updated property is never changed by the user
// explicitly, but the "latest" is copied into the audit log.
export type UserTaskAudit = Partial<Omit<UserTask, 'audit' | 'id' | 'source'>> & {
  audit?: never;
  id?: never;
  source?: never;
};

export interface UserTask {
  id?: string;
  description: string;
  summary: string;
  status: WorkflowState;
  source: TaskSource;
  updated: number;
  votes: CouncilVotesMap;
  audit: UserTaskAudit[];
}

export type TasksIpc = {
  // create
  read: {
    incomplete: () => Promise<UserTask[]>;
  };
  update: {
    set: (taskId: string, newData: Partial<UserTask>) => Promise<UserTask>;
  };
  // update
  // delete
};

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
