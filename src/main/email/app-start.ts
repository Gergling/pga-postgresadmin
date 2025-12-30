import { TriageEmailTasksResponse } from "../common/types";
import { triageEmailTasks } from "../features/scheduler/email-task-triage";

export const emailHandlers: {
  triageEmailTasks: () => Promise<TriageEmailTasksResponse>;
} = {
  triageEmailTasks,
};
