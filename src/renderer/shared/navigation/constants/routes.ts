import {
  Checklist,
  // Home,
  Image,
  Menu,
  // QuestionMark,
  WorkOutline
} from "@mui/icons-material";
import { redirect } from "react-router-dom";
import { Home, Placeholder } from "../../../features/svg-viewer/components";
import {
  HomeView,
  JobSearchView,
  SvgViewerView,
  View404
} from "../../../views";
import { UiNavigationConfigItem } from "../types";
import { getNavigationItem, lazyImport } from "./utilities";
import { TASK_VIEW_CONFIG } from "./tasks";
import { JOB_SEARCH_VIEW_CONFIG } from "./job-search";
import { getNavigationIcon } from "../components/getNavigationIcon";

const lazyImports = {
  root: lazyImport(() => import('../../../views/Root')),
  home: lazyImport(() => import('../../../views/Home')),
  tasks: lazyImport(() => import('../../../views/Tasks')),
};

const config: UiNavigationConfigItem = {
  HydrateFallback: () => null,
  icon: getNavigationIcon(Placeholder),
  label: 'Root',
  lazy: lazyImports.root,
  path: '/',
  children: [
    {
      index: true,
      loader: () => redirect('/home'),
      omitBreadcrumb: true,
    },
    {
      element: HomeView,
      icon: getNavigationIcon(Home),
      label: 'Home',
      path: 'home',
    },
    {
      lazy: lazyImports.tasks,
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
    },
    {
      icon: getNavigationIcon(Placeholder),
      label: 'Job Search',
      element: JobSearchView,
      path: 'jobsearch',
      children: JOB_SEARCH_VIEW_CONFIG,
    },
    {
      icon: getNavigationIcon(Placeholder),
      label: 'SVG Viewer',
      // lazy: lazyImports.svgViewer,
      element: SvgViewerView,
      path: 'svgs',
    },
    {
      // Need some proper 404 options JIC. Welcome to the void. Maybe it's time for that eye in your nightmare.
      path: '*',
      element: View404,
      omitBreadcrumb: true,
    },
  ],
};

export const NAVIGATION_TREE = getNavigationItem(config);
