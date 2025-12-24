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

export interface UserTask {
  id?: string;
  text: string;
  energy: number;   // -5 (drains) to +5 (recharges)
  friction: number;       // 1 (easy) to 10 (hard/phone calls)
  timestamp: number;
}