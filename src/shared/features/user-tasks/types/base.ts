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

export type TaskSource = 'manual' | 'email' | 'diary' | 'instructions';
