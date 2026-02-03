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

type TaskSourceTypeManual = 'manual';
type TaskSourceTypeAutomated = 'email' | 'diary' | 'instructions';
export type TaskSourceType = TaskSourceTypeManual | TaskSourceTypeAutomated;

export type TaskSource = {
  id: string;
  type: TaskSourceTypeAutomated;
} | {
  // If the type is manual, we don't want an id.
  // The type should always be compatiable with TaskSourceType.
  id?: never;
  type: TaskSourceTypeManual;
};
