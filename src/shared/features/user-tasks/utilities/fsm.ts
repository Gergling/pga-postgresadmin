import { TASK_FSM } from "../constants";
import { TaskWorkflowEvent, TaskWorkflowState } from "../schema";

export const reduceFsm = (
  status: TaskWorkflowState,
  event: TaskWorkflowEvent
): TaskWorkflowState => {
  const next = TASK_FSM[status];
  if (!next) return status;
  return next[event] || status;
};
