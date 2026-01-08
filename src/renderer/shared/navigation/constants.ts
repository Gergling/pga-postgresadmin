import {
  Assignment,
  Balance,
  Checklist,
  Home,
  Menu,
  MilitaryTech,
  PauseCircle,
  Rocket
} from "@mui/icons-material";
import { Outlet, redirect } from "react-router-dom";
import { HomeView } from "../../views";
import { TaskViewConfigName, UiNavigationConfigItem, UiNavigationItem } from "./types";

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
] as const;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lazyImport = <T extends Record<string, any>>(
  factory: () => Promise<T>,
  name: keyof T = 'default'
): UiNavigationConfigItem['lazy'] => {
  return async () => {
    const module = await factory();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { Component: module[name] as React.ComponentType<any> };
  };
};
const config: UiNavigationConfigItem = {
  icon: Menu,
  label: 'Root',
  lazy: lazyImport(() => import('../../views/Root')),
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
      element: Outlet,
      icon: Checklist,
      label: 'Tasks',
      path: 'tasks',
      children: [
        {
          index: true,
          loader: () => {
            console.log('indexRedirectionLoader')
            return redirect('proposed');
          },
          omitBreadcrumb: true,
        },
        ...TASK_VIEW_CONFIG.map((item) => ({
          ...item,
          lazy: lazyImport(() => import('../../views/Tasks')),
        })),
      ],
    },
    {
      // Need some proper 404 options JIC.
      path: '*',
      element: HomeView,
      omitBreadcrumb: true,
    },
  ],
};

const getNavigationItem = (
  { children, index, label, omitBreadcrumb, ...item }: UiNavigationConfigItem
): UiNavigationItem => {
  const base = {
    ...item,
    label: label ?? `${item.path}`,
    omitBreadcrumb: omitBreadcrumb ?? false,
  };

  if (index) return {
    ...base,
    index: true,
    children: undefined,
  }
  return {
    ...base,
    children: children ? children.map(getNavigationItem) : [],
    index: false,
  };
};

export const NAVIGATION_TREE = getNavigationItem(config);
