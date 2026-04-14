import { createHashRouter, redirect } from "react-router-dom";
import { Placeholder } from "../features/svg-viewer/components";
import {
  JobSearchView,
  SvgViewerView,
  View404
} from ".";
import { UiNavigationConfigItem } from "../shared/navigation/types";
import { getNavigationItem, lazyImport } from "../shared/navigation/constants/utilities";
import { TASKS_ROUTES } from "../features/tasks/routes";
import { JOB_SEARCH_VIEW_CONFIG } from "../shared/navigation/constants/job-search";
import { getNavigationIcon } from "../shared/navigation/components/getNavigationIcon";
import { PROJECT_ROUTES } from "@/renderer/features/projects/routes";
import { reduceRoutes } from "../shared/navigation/utilities";
import { SETTINGS_ROUTES } from "../features/settings";
import { HOME_ROUTES } from "../features/home/routes";
import { HOME_BASE_ROUTE } from "../features/home/constants";

const lazyImports = {
  root: lazyImport(() => import('./Root')),
  home: lazyImport(() => import('./Home')),
  tasks: lazyImport(() => import('./Tasks')),
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
      loader: () => redirect(`/${HOME_BASE_ROUTE}`),
      omitBreadcrumb: true,
    },
    HOME_ROUTES,
    TASKS_ROUTES,
    {
      icon: getNavigationIcon(Placeholder),
      label: 'Job Search',
      element: JobSearchView,
      path: 'jobsearch',
      children: JOB_SEARCH_VIEW_CONFIG,
    },
    PROJECT_ROUTES,
    SETTINGS_ROUTES,
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

const routes = reduceRoutes([], NAVIGATION_TREE);
export const NAVIGATION_ROUTER = createHashRouter(routes);
