import { TaskStatus } from './config';

export const TASK_STATUS_PROPAGATION_ORDER: TaskStatus[] = [
  'error',
  'warning',
  'information',
  'success',
  'awaiting',
] as const;
