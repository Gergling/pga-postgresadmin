import { triageEmailTasks } from "../scheduler/email-task-triage";
import { TriageTasksResponse } from "../tasks";

export const emailHandlers: {
  triageEmailTasks: () => Promise<TriageTasksResponse>;
} = {
  triageEmailTasks,
};
