import { PropsWithChildren, useCallback, useMemo } from "react";
import { contextFactory } from "@gergling/ui-components";
import { TaskCore } from "@/shared/features/user-tasks";
import { useUserTasks } from "../context";

export const {
  Provider: TaskDetailProvider,
  useContextHook: useTaskDetail,
} = contextFactory(({ taskId }: PropsWithChildren & { taskId: string }) => {
  const { getTask, status: taskStatus } = useUserTasks();
  const status = useMemo(
    () => taskStatus[taskId] ?? {
      props: {}, status: 'idle'
    }, [taskId, taskStatus]
  );
  const task = useMemo(() => getTask(taskId), [getTask, taskId]);

  const getPropertyPersistenceStatus = useCallback(
    (prop: keyof TaskCore) => status.props[prop] ?? 'idle',
    [status]
  );

  return {
    getPropertyPersistenceStatus, status, task, taskId
  };
}, 'tasks:detail');
