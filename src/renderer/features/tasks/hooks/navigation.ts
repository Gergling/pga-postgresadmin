import { useEffect, useMemo } from "react";
import { useIpc } from "../../../shared/ipc";
import { TASK_VIEW_CONFIG, UiNavigationConfigItem, useNavigationRegister } from "../../../shared/navigation";
import { TaskView } from "../types";
import { createUiUserTask, getTaskHistoryItem } from "../utilities";

const reduceTaskView = (
  acc: TaskView[],
  item: UiNavigationConfigItem
): TaskView[] => {
  const { icon, label, path } = item;
  if (!icon || !label || !path) return acc;
  return [ ...acc, { icon, label, path }];
};

export const useTaskNavigation = () => {
  const taskViews = useMemo(() => TASK_VIEW_CONFIG.reduce(reduceTaskView, []), []);
  const viewNames = useMemo(() => taskViews.map(({ path }) => path), [taskViews]);
  const { subscribe } = useNavigationRegister();
  const { readTaskForId } = useIpc();

  useEffect(() => {
    // This is to make sure we have a displayable history of icons and labels
    // for specific tasks that may be missing because they've been completed,
    // for example.
    return subscribe(async ({ params: { taskId }, pathname }) => {
      if (!taskId) throw new Error('No task ID found');
      const pathViewName = viewNames.find((name) => pathname.includes(name));
      const task = await readTaskForId(taskId);

      return getTaskHistoryItem(createUiUserTask(task), pathViewName);
    });
  }, [readTaskForId, subscribe, viewNames]);
};
