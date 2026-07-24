import { TASK_FSM, WorkflowEvent, TaskWorkflowState } from "../../../../shared/features/user-tasks";

export const reduceFsm = (
  status: TaskWorkflowState,
  event: WorkflowEvent
): TaskWorkflowState => {
  const next = TASK_FSM[status];
  if (!next) return status;
  return next[event] || status;
};
