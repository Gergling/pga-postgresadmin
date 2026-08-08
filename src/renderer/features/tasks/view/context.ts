import { PropsWithChildren, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { GridRowParams } from "@mui/x-data-grid";
import { TabsProps } from "@mui/material";
import { contextFactory } from "@gergling/ui-components";
import { Task } from "@/shared/features/user-tasks";
import {
  UiNavigationConfigItem,
  useNavigation,
} from "@/renderer/shared/navigation";
import { TaskView } from "../types";
import { useTaskFactory } from "../shared";
import { TASK_VIEW_CONFIG } from "./config";
import { getTaskPath } from "./utilities";
import { getViewTasks, TASK_GRID_PROPS } from "./list";

const reduceTaskView = (
  acc: TaskView[],
  item: UiNavigationConfigItem
): TaskView[] => {
  const { icon, label, path } = item;
  if (!icon || !label || !path) return acc;
  return [...acc, { icon, label, path }];
};

export const {
  Provider: UserTasksProvider,
  useContextHook: useUserTasks,
} = contextFactory((_: PropsWithChildren) => {
  const navigate = useNavigate();
  const taskViews = useMemo(() => TASK_VIEW_CONFIG.reduce(reduceTaskView, []), []);
  const viewNames = useMemo(() => taskViews.map(({ path }) => path), [taskViews]);
  const { breadcrumbs, current: currentView } = useNavigation();

  const {
    isLoading: listIsLoading, getStatus, getTask, status, tasks
  } = useTaskFactory({ type: 'incomplete' });
  const viewTasks = useMemo(
    () => getViewTasks([...tasks.values()], currentView, viewNames),
    [tasks, currentView, viewNames]
  );
  const isListView = useMemo(() => !!viewTasks.list, [viewTasks]);

  const activeTab = useMemo((): {
    name: string | undefined; colour: TabsProps['textColor'];
  } => {
    const highlightActive = !isListView && !currentView;
    const activeTab = breadcrumbs.find(({ name }) => viewNames.includes(name));
    const colour = highlightActive ? 'secondary' : 'primary';
    const name = activeTab?.name;

    return {
      name,
      colour,
    };
  }, [breadcrumbs, isListView, currentView, taskViews]);

  const handleDetailViewNavigation = useCallback(
    ({ row: { envelope: { id } } }: GridRowParams<Task>) => navigate(getTaskPath(id, activeTab.name)),
    [activeTab.name, navigate]
  );

  const {
    list: {
      columns,
      data: rows,
    },
    message,
    success: successListView,
  } = useMemo(() => ({
    ...viewTasks,
    list: viewTasks.list ?? {
      columns: [],
      data: [],
    },
  }), [viewTasks]);

  // useEffect(() => {
  //   if (currentTask) {
  //     // register(getTaskHistoryItem(currentTask, activeTab.name));
  //   }
  // }, [activeTab.name, register, currentTask]);

  return {
    activeTab,
    currentView,
    getStatus,
    getTask,
    grid: {
      ...TASK_GRID_PROPS,
      columns,
      loading: listIsLoading,
      onRowClick: handleDetailViewNavigation,
      rows,
    },
    isListView,
    message,
    status,
    successListView,
    taskViews,
  };
}, 'tasks');
