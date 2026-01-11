import { TASK_FSM, WorkflowEvent, WorkflowState } from "../../../../shared/features/user-tasks";

export const reduceFsm = (
  status: WorkflowState,
  event: WorkflowEvent
): WorkflowState => {
  const next = TASK_FSM[status];
  if (!next) return status;
  return next[event] || status;
};
