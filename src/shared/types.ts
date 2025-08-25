export type UncertainBoolean = 'yes' | 'no' | 'unknown';

export type WorkflowState = 'todo' | 'doing' | 'done';

export type CommandStatusResponse<T = boolean> = {
  error?: string;
  status: T;
  stderr?: string;
  stdout?: string;
};
