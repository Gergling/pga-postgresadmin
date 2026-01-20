import { contextFactory } from "@gergling/ui-components";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserTask } from "../../../shared/features/user-tasks";
import { useIpc } from "../../shared/ipc";
import { TASK_VIEW_CONFIG, UiNavigationConfigItem, useNavigation } from "../../shared/navigation";
import { getViewTasks } from "./utilities";
import { TASK_GRID_PROPS } from "./constants/grid";

type TaskView = {
  icon: Required<UiNavigationConfigItem>['icon'];
  label: string;
  path: string;
};

const reduceTaskView = (
  acc: TaskView[],
  item: UiNavigationConfigItem
): TaskView[] => {
  const { icon, label, path } = item;
  if (!icon || !label || !path) return acc;
  return [ ...acc, { icon, label, path }];
};

export const {
  Provider: UserTasksProvider,
  useContextHook: useUserTasks,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} = contextFactory((_: PropsWithChildren) => {
  const taskViews = useMemo(() => TASK_VIEW_CONFIG.reduce(reduceTaskView, []), []);
  const viewNames = useMemo(() => taskViews.map(({ path }) => path), [taskViews]);
  const { readIncompleteTasks } = useIpc();
  const { current: currentView } = useNavigation();
  const selectTasks = useCallback(
    (data: UserTask[]) => getViewTasks(data || [], currentView, viewNames),
    [currentView, taskViews]
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
    currentView,
    grid: {
      ...TASK_GRID_PROPS,
      columns,
      loading,
      rows,
    },
    message,
    success,
    taskViews,
  };
}, 'tasks');
