import { useCallback, useMemo } from "react";
import {
  Task,
  TaskCore,
  TaskWorkflowEvent
} from "@/shared/features/user-tasks";
import { TaskAction } from "../../types";
import { useFsm } from "./fsm";

export const useUserTask = (task: Task) => {
  const { envelope: { id, data: { status } } } = task;
  const { events } = useFsm(status);

  const actionFactory = useCallback((event: TaskWorkflowEvent) => async () => {
    task.applyStatusEvent(event);
    await task.persist();
  }, [id, status]);
  const actions = useMemo(() => events.map(({ event }): TaskAction => ({
    ...event,
    action: actionFactory(event.name),
  })), [actionFactory, events]);

  const save = async (updatedTaskData: Partial<TaskCore>) => {
    task.updateData(updatedTaskData);
    await task.persist();
  };

  return {
    actions,
    save,
  };
};
