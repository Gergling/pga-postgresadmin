import { createElement } from "react";
import { Task } from "@/shared/features/user-tasks";
import { BreadcrumbNavigationHistoryItem } from "@/renderer/shared/navigation";
import { TaskRune } from "../shared/components";

export const getTaskPath = (
  id: string | undefined, viewName: string | undefined
) => `/tasks/${viewName}/${id}`;

export const getTaskHistoryItem = (
  { envelope: task }: Task,
  viewName?: string
): BreadcrumbNavigationHistoryItem => ({
  icon: () => createElement(TaskRune, { task }),
  label: `${task.data.summary.slice(0, 8)}...`,
  path: getTaskPath(task.id, viewName || 'proposed'),
  status: 'success',
});
