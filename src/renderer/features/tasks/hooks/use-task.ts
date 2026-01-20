import { useCallback, useMemo } from "react";
import { WorkflowEvent } from "../../../../shared/features/user-tasks";
import { useNavigation } from "../../../shared/navigation";
import { TaskAction, UiUserTask } from "../types";
import { reduceFsm } from "../utilities/fsm";
import { useFsm } from "./fsm";
import { useUpdateTask } from "./update";

export const useUserTask = (task: UiUserTask) => {
  const { id, status } = task;
  const { events } = useFsm(status);
  const { current } = useNavigation();
  const {
    mutate: updateTask,
    status: mutationStatus,
  } = useUpdateTask(current?.name || '');
  const actionFactory = useCallback((event: WorkflowEvent) => () => {
    if (!id) return;

    const newData: Partial<UiUserTask> = {
      status: reduceFsm(status, event),
    };

    updateTask({ taskId: id, newData });
  }, [id, status, updateTask]);
  const actions = useMemo(() => events.map(({ event }): TaskAction => ({
    ...event,
    action: actionFactory(event.name),
  })), [actionFactory, events]);

  return {
    actions,
    status: mutationStatus,
  };
};
