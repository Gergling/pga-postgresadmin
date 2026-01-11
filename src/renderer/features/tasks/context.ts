import { contextFactory } from "@gergling/ui-components";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { UserTask } from "../../../shared/features/user-tasks";
import { useIpc } from "../../shared/ipc";
import { TASK_VIEW_CONFIG, UiNavigationConfigItem, useNavigation } from "../../shared/navigation";
import { getViewTasks } from "./utilities";
import { TASK_GRID_PROPS } from "./constants/grid";
import { useQuery } from "@tanstack/react-query";

const reduceTaskViewNames = (acc: string[], { path }: UiNavigationConfigItem) => {
  if (!path) return acc;
  return [ ...acc, path];
};

export const {
  Provider: UserTasksProvider,
  useContextHook: useUserTasks,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} = contextFactory((_: PropsWithChildren) => {
  const taskViewNames = useMemo(() => TASK_VIEW_CONFIG.reduce(reduceTaskViewNames, []), []);
  const { readIncompleteTasks } = useIpc();
  const { current: currentView } = useNavigation();
  const selectTasks = useCallback(
    (data: UserTask[]) => getViewTasks(data || [], currentView, taskViewNames),
    [currentView, taskViewNames]
  );

  const {
    data,
    isLoading: loading,
  } = useQuery({
    queryKey: ['tasks', currentView?.name],
    queryFn: readIncompleteTasks,
    select: selectTasks
  });

  const {
    columns,
    data: rows,
    message,
    success,
  } = useMemo(() => data || {
    columns: [],
    data: [],
    message: '',
    success: false,
  }, [data]);

  return {
    grid: {
      ...TASK_GRID_PROPS,
      columns,
      loading,
      rows,
    },
    message,
    success,
  };
}, 'blog');
