import { createElement } from "react";
import { BreadcrumbNavigationHistoryItem } from "../../../shared/navigation";
import { TaskRune } from "../components/Rune";
import { TaskRich } from "@/shared/features/user-tasks";

export const getTaskPath = (id: string | undefined, viewName: string | undefined) => `/tasks/${viewName}/${id}`;

export const getTaskHistoryItem = (
  task: TaskRich,
  viewName?: string
): BreadcrumbNavigationHistoryItem => ({
  icon: () => createElement(TaskRune, { task }),
  label: `${task.data.summary.slice(0, 8)}...`,
  path: getTaskPath(task.id, viewName || 'proposed'),
  status: 'success',
});
