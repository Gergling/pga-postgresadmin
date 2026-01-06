import { LoaderFunction, redirect, RouteObject } from "react-router-dom";
import { TasksView } from "../../../views";
import { Assignment, Balance, Checklist, MilitaryTech, PauseCircle, Rocket } from "@mui/icons-material";
import { createElement } from "react";
import { UiRouteConfigTemplateItem } from "./types";

export const TASK_VIEW_CONFIG = [
  {
    index: true,
    label: 'Proposed Tasks',
    name: 'proposed',
    Icon: Assignment
  },
  {
    label: 'Quick Tasks',
    name: 'quick',
    Icon: Rocket
  },
  {
    label: 'Important Tasks',
    name: 'important',
    Icon: MilitaryTech
  },
  // {
  //   label: 'Deep Work', // High mass proposal
  //   name: 'deep',
  //   Icon: <Engineering />
  // },
  {
    label: 'Abstained',
    name: 'abstained',
    Icon: PauseCircle
  },
  {
    label: 'Awaiting Votes',
    name: 'awaiting',
    Icon: Balance
  },
] as const;

type TaskViewConfig = typeof TASK_VIEW_CONFIG;
type TaskViewConfigItem = TaskViewConfig[number];
export type TaskViewConfigName = TaskViewConfigItem['name'];

// TODO: Reduce a single pass for this, instead of two array calls.
const indexView = TASK_VIEW_CONFIG.find((item) => 'index' in item ? item.index : false);
const validViews: TaskViewConfigName[] = TASK_VIEW_CONFIG.map((item) => item.name);

if (!indexView) throw new Error('No index view for Tasks. This is a basic configuration error that should never happen.');

const loader: LoaderFunction = ({ params }) => {
  // Logic to validate the view or provide a default
  const view = params.view as TaskViewConfigName;
  console.log('loader', view)

  if (!params.view) return { view: indexView.name }; // The Index behavior
  if (!validViews.includes(view)) throw new Response("Not Found", { status: 404 });
  
  return { view };
};

// const indexRedirectionLoader: LoaderFunction = () => redirect(indexView.name);
const indexRedirectionLoader: LoaderFunction = () => {
  console.log('indexRedirectionLoader')
  return redirect(`/${indexView.name}`);
};

// export const getTaskRouteConfig = (): BaseRoute => ({
export const getTaskRouteConfig = (): UiRouteConfigTemplateItem => {
  // TODO: Why does this route not display anything at /tasks?
  const children: RouteObject[] = [
    {
      // 1. The Index Redirect:
      // When the URL is exactly "/tasks", redirect to "/tasks/proposed"
      index: true,
      loader: indexRedirectionLoader,
    },
    {
      // 2. The Dynamic View:
      // This handles "/tasks/proposed", "/tasks/important", etc.
      path: ":view",
      element: createElement(TasksView),
      loader,
      // You can add your handle here for the useMatches logic we discussed
      // handle: { isTaskRoute: true } as RouteHandle,
    },
    {
      // 3. Optional: Catch-all for /tasks/invalid-url
      path: "*",
      loader: indexRedirectionLoader,
    }
  ];
  return {
    icon: Checklist,
    label: 'Tasks',
    path: '/tasks',
    element: TasksView,
    children,
    // TODO: Maybe check if this... *does*... anything?
    loader: () => {
      console.log('getTaskRouteConfig loader')
      return redirect('/tasks/proposed');
    },
  };
};
