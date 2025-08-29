export type UncertainBoolean = 'yes' | 'no' | 'unknown';

export type WorkflowState = 'todo' | 'doing' | 'done';

export type CommandResponse = {
  error?: string;
  stderr?: string;
  stdout?: string;
};

export type CommandStatusResponse<T = boolean> = CommandResponse & {
  status: T;
};

export type GeneralResponse = {
  success: boolean;
  error?: string;
};
