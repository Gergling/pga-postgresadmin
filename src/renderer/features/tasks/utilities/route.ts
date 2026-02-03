import { createElement } from "react";
import { BreadcrumbNavigationHistoryItem } from "../../../shared/navigation";
import { TaskRune } from "../components/Rune";
import { UiUserTask } from "../types";

export const getTaskPath = (id: string | undefined, viewName: string | undefined) => `/tasks/${viewName}/${id}`;

export const getTaskHistoryItem = (
  task: UiUserTask<true>,
  viewName?: string
): BreadcrumbNavigationHistoryItem => ({
  icon: () => createElement(TaskRune, { task }),
  label: `${task.summary.slice(0, 8)}...`,
  path: getTaskPath(task.id, viewName || 'proposed'),
  status: 'success',
});
