import { createHashRouter, redirect } from "react-router-dom";
import { Placeholder } from "../features/svg-viewer/components";
import {
  // JobSearchView,
  RootView,
  SvgViewerView,
  View404
} from ".";
import { UiNavigationConfigItem } from "../shared/navigation/types";
import { getNavigationItem } from "../shared/navigation/utilities/navigation";
import { TASKS_ROUTES } from "../features/tasks/routes";
import { JOB_SEARCH_VIEW_CONFIG } from "@/renderer/features/job-search";
import { getNavigationIcon } from "../shared/navigation/components/getNavigationIcon";
import { PROJECT_ROUTES } from "@/renderer/features/projects/routes";
import { reduceRoutes } from "../shared/navigation/utilities";
import { HOME_BASE_ROUTE, HOME_ROUTES } from "../features/home";
import { EXPLORER_ROUTES } from "../features/explorer";
import { META_ROUTES } from "../features/meta";

const config: UiNavigationConfigItem = {
  HydrateFallback: () => null,
  icon: getNavigationIcon(Placeholder),
  label: 'Root',
  element: RootView,
  path: '/',
  children: [
    {
      index: true,
      loader: () => redirect(`/${HOME_BASE_ROUTE}`),
      omitBreadcrumb: true,
    },
    HOME_ROUTES,
    TASKS_ROUTES,
    // {
    //   icon: getNavigationIcon(Placeholder),
    //   label: 'Job Search',
    //   element: JobSearchView,
    //   path: 'jobsearch',
    //   children: JOB_SEARCH_VIEW_CONFIG,
    // },
    PROJECT_ROUTES,
    EXPLORER_ROUTES,
    META_ROUTES,
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
