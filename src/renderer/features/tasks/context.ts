import { PropsWithChildren, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { contextFactory } from "@gergling/ui-components";
import { GridRowParams } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { UserTask } from "../../../shared/features/user-tasks";
import { useIpc } from "../../shared/ipc";
import {
  TASK_VIEW_CONFIG,
  UiNavigationConfigItem,
  useNavigation,
  useNavigationRegister
} from "../../shared/navigation";
import { TASK_GRID_PROPS } from "./constants";
import { TaskView, UiUserTask } from "./types";
import { createUiUserTask, getViewTasks } from "./utilities";
import { useTaskQueryCache } from "./hooks/cache";
import { getTaskPath } from "./utilities/route";
import { TabsProps } from "@mui/material";

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
  const navigate = useNavigate();
  const taskViews = useMemo(() => TASK_VIEW_CONFIG.reduce(reduceTaskView, []), []);
  const viewNames = useMemo(() => taskViews.map(({ path }) => path), [taskViews]);
  const { readIncompleteTasks, readTaskForId } = useIpc();
  const { breadcrumbs, current: currentView } = useNavigation();
  const { register } = useNavigationRegister();

  // Fetch a specific task. if it's already loaded, use that one.
  const { taskId } = useParams();
  const {
    data: currentTask,
    isLoading: taskIsLoading,
    isError: taskLoadingIsError,
    error: taskLoadingError,
    isSuccess: taskIsSuccess,
  } = useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => taskId ? readTaskForId(taskId) : undefined,
    enabled: !!taskId,
    select: (data) => data ? createUiUserTask(data) : undefined,
  });
  const isListView = useMemo(() => !taskId, [taskId]);

  const activeTab = useMemo((): { name: string | undefined; colour: TabsProps['textColor'] } => {
    const highlightActive = !isListView && !currentView;
    const activeTab = breadcrumbs.find(({ name }) => viewNames.includes(name));
    const colour = highlightActive ? 'secondary' : 'primary';
    const name = activeTab?.name;

    return {
      name,
      colour,
    };
  }, [breadcrumbs, isListView, currentView, taskViews]);

  const selectTasks = useCallback(
    (data: UserTask[]) => getViewTasks(data || [], currentView, viewNames),
    [currentView, register, viewNames]
  );
  const handleDetailViewNavigation = useCallback(
    ({ row: { id } }: GridRowParams<UiUserTask>) => navigate(getTaskPath(id, activeTab.name)),
    [activeTab.name, navigate]
  );

  const {
    data,
    isLoading: loading,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: readIncompleteTasks,
    select: selectTasks
  });

  const {
    columns,
    data: rows,
    message,
    success: successListView,
  } = useMemo(() => data || {
    columns: [],
    data: [],
    message: '',
    success: false,
  }, [data]);

  // TODO: Should be able to do this once from a/the task mutation hook.
  useTaskQueryCache(taskIsSuccess, currentTask);

  return {
    activeTab,
    currentTask,
    currentView,
    grid: {
      ...TASK_GRID_PROPS,
      columns,
      loading,
      onRowClick: handleDetailViewNavigation,
      rows,
    },
    isListView,
    message,
    successListView,
    taskIsLoading,
    taskLoadingError,
    taskLoadingIsError,
    taskViews,
  };
}, 'tasks');
