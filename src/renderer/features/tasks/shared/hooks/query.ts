import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { skipToken } from "@tanstack/react-query";
import { getObjectKeys } from "@/shared/utilities";
import {
  Task,
  TaskCore,
  taskFactory,
  TaskIpcReadParameters,
  TaskSerialisation
} from "@/shared/features/user-tasks";
import { trpcReact } from "@/renderer/libs/react-query";

type TaskKey = keyof TaskCore;
type PersistenceStatus = 'idle' | 'mutating' | 'refetching';
type State = Record<string, {
  props: Partial<Record<TaskKey, PersistenceStatus>>
  status: PersistenceStatus;
  task?: Task;
}>;
type Action = {
  keys: TaskKey[];
  id: string;
  status: PersistenceStatus;
  task?: Task;
};

const propStatusReducer = (
  state: Partial<Record<TaskKey, PersistenceStatus>>, { keys, status }: {
    keys: TaskKey[];
    status: PersistenceStatus;
  }
): Partial<Record<TaskKey, PersistenceStatus>> => ({
  ...state,
  ...Object.fromEntries(keys.map((k) => [k, status])),
});
const persistenceStatusReducer = (
  state: State, { keys, id, status, ...action }: Action
): State => ({
  ...state,
  [id]: {
    ...state[id],
    ...action,
    props: propStatusReducer(
      (state[id] ?? { props: {} }).props,
      { keys, status }
    ),
    status,
  },
});

export const useTaskFactory = (initialReadParams?: TaskIpcReadParameters) => {
  const [status, dispatch] = useReducer(persistenceStatusReducer, {});
  const getStatus = useCallback(
    (id: string, key?: TaskKey) => key
      ? status[id]?.props[key]
      : status[id]?.status ?? 'idle',
    [status]
  );
  const [
    readParams, setReadParams
  ] = useState<TaskIpcReadParameters | undefined>(initialReadParams);
  const {
    data, refetch, ...props
  } = trpcReact.tasks.read.useQuery(
    readParams ?? skipToken
  );
  const { mutateAsync } = trpcReact.tasks.update.useMutation();

  const fromIpc = useCallback((
    data: TaskSerialisation,
  ): Task => {
    const task = taskFactory.fromIpc(data)
    task.onPersist(async ({
      changes, serialised,
    }) => {
      const id = serialised.id;
      const keys = getObjectKeys(changes);
      setReadParams({ type: 'id', id });
      dispatch({ id, keys, status: 'mutating', task });
      await mutateAsync(serialised);
      dispatch({ id, keys, status: 'refetching' });
      await refetch();
      dispatch({ id, keys, status: 'idle' });
    });
    return task;
  }, [dispatch, mutateAsync, refetch, setReadParams]);

  const [taskMap, dispatchTasks] = useReducer((
    state, action: TaskSerialisation[]
  ) => action.reduce((acc, value) => ({
    ...acc,
    [value.id]: fromIpc(value),
  }), state), {} as Record<string, Task>);

  const getTask = useCallback((id: string): Task | undefined => {
    setReadParams({ type: 'id', id });
    return taskMap[id];
  }, [taskMap, setReadParams]);

  const tasks = useMemo(() => Object.values(taskMap), [taskMap]);

  useEffect(() => {
    if (data && data.length) dispatchTasks(data);
  }, [data]);

  return {
    ...props,
    fromIpc,
    getStatus,
    getTask,
    status,
    tasks,
  }
};
