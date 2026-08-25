import { TaskSourceType } from "../schema";

type TriageTasksStatus = 'success' | 'error';

export type TriageTasksResponse = {
  message: string;
  source: TaskSourceType;
  status: TriageTasksStatus;
};
