import { Placeholder } from "../svg-viewer/components";
import { UiNavigationConfigItem } from "../../shared/navigation/types";
import { getNavigationIcon } from "../../shared/navigation/components/getNavigationIcon";
// import { lazyImport } from "@/renderer/shared/navigation";
import { redirect } from "react-router-dom";
import { TasksRoot } from "./components";
import { TASK_VIEW_CONFIG } from "./views";

export const TASKS_ROUTES: UiNavigationConfigItem = {
  // lazy: lazyImport(() => import('./components/Root')),
  element: TasksRoot,
  icon: getNavigationIcon(Placeholder),
  label: 'Tasks',
  path: 'tasks',
  children: [
    {
      index: true,
      loader: () => redirect('proposed'),
      omitBreadcrumb: true,
    },
    ...TASK_VIEW_CONFIG.map((item) => ({
      // If we're putting everything through the same view outlet provider, these don't need to be routes.
      // So we could have an omitRoute
      ...item,
      index: undefined,
      children: [
        {
          label: '(Unnamed Task)', // Find a way to omit this.
          path: ':taskId',
          icon: getNavigationIcon(Placeholder), // Find a way to omit this.
          element: () => 'Task Detail View',
        }
      ],
    })),
    {
      path: '*',
      element: () => 'Tasks 404',
      omitBreadcrumb: true,
    },
  ],
};
