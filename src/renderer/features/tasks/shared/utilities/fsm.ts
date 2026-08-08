import {
  TASK_FSM,
  TaskWorkflowEvent,
  TaskWorkflowState,
} from "@/shared/features/user-tasks";

export const reduceFsm = (
  status: TaskWorkflowState,
  event: TaskWorkflowEvent
): TaskWorkflowState => {
  const next = TASK_FSM[status];
  if (!next) return status;
  return next[event] || status;
};
