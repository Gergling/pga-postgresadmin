import { TaskSource, WorkflowState } from "./base";
import { CouncilVotesMap } from "./votes";

type UserTaskBaseId = { id: string; };

type UserTaskBase = {
  // comments: Comment[];
  description: string;
  source: TaskSource;
  status: WorkflowState;
  summary: string;
  timeline: {
    due?: number; // The due date/time in epoch milliseconds.
    start?: number; // The start date/time in epoch milliseconds.
  };
  updated: number; // Time of update in epoch milliseconds.
  votes: CouncilVotesMap;
};

// Audit log for immutability patterns.
// Some properties should never be changed and therefore don't need to
// feature in the audit. The updated property is never changed by the user
// explicitly, but the "latest" is copied into the audit log.
type AuditOmittedKey = 'audit' | 'source';
export type UserTaskAudit = Partial<
  & Omit<UserTaskBase, AuditOmittedKey>
  & Record<AuditOmittedKey, never>
>;

export type UserTask = UserTaskBase & UserTaskBaseId & {
  audit: UserTaskAudit[];
  children: UserTask[];
}
