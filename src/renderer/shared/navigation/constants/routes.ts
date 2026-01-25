import {
  Assignment,
  Balance,
  Checklist,
  Home,
  Image,
  Menu,
  MilitaryTech,
  PauseCircle,
  Rocket
} from "@mui/icons-material";
import { redirect } from "react-router-dom";
import { HomeView, SvgViewerView, View404 } from "../../../views";
import { TaskViewConfigName, UiNavigationConfigItem } from "../types";
import { getNavigationItem, lazyImport } from "./utilities";

export const TASK_VIEW_CONFIG: UiNavigationConfigItem<TaskViewConfigName>[] = [
  {
    label: 'Proposed Tasks',
    path: 'proposed',
    icon: Assignment
  },
  {
    label: 'Quick Tasks',
    path: 'quick',
    icon: Rocket
  },
  {
    label: 'Important Tasks',
    path: 'important',
    icon: MilitaryTech
  },
  // {
  //   label: 'Deep Work', // High mass proposal
  //   path: '/deep',
  //   icon: <Engineering />
  // },
  {
    label: 'Abstained',
    path: 'abstained',
    icon: PauseCircle
  },
  {
    label: 'Awaiting Votes',
    path: 'awaiting',
    icon: Balance
  },
];

const lazyImports = {
  root: lazyImport(() => import('../../../views/Root')),
  home: lazyImport(() => import('../../../views/Home')),
  tasks: lazyImport(() => import('../../../views/Tasks')),
};

const config: UiNavigationConfigItem = {
  HydrateFallback: () => null,
  icon: Menu,
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
      icon: Home,
      label: 'Home',
      path: 'home',
    },
    {
      lazy: lazyImports.tasks,
      icon: Checklist,
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
          lazy: lazyImports.tasks,
        })),
      ],
    },
    {
      icon: Image,
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
