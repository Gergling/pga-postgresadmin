import { TaskSource, WorkflowState } from "./base";
import { CouncilVotesMap } from "./votes";

type UserTaskBase = {
  // comments: Comment[];
  description: string;
  id?: string;
  source: TaskSource;
  status: WorkflowState;
  summary: string;
  updated: number; // Time of update in epoch milliseconds.
  votes: CouncilVotesMap;
};

// Audit log for immutability patterns.
// Some properties should never be changed and therefore don't need to
// feature in the audit. The updated property is never changed by the user
// explicitly, but the "latest" is copied into the audit log.
type AuditOmittedKey = 'audit' | 'id' | 'source';
export type UserTaskAudit = Partial<
  & Omit<UserTask, AuditOmittedKey>
  & Record<AuditOmittedKey, never>
>;

export type UserTask = UserTaskBase & {
  audit: UserTaskAudit[];
}
