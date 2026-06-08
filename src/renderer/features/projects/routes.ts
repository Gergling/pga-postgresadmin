import { createElement } from "react";
import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../svg-viewer/components";
import {
  ProjectDetailChat,
  ProjectDetailExplorer,
  ProjectDetailOverview,
  ProjectGuard,
  ProjectsList,
  ProjectsRoot
} from "./components";
import {
  PROJECTS_BASE_ROUTE,
  PROJECTS_CHILD_TABS,
  ProjectTabPath
} from "./constants";

const projectElements: Record<
  ProjectTabPath, React.ComponentType
> = {
  '': ProjectDetailOverview,
  chat: ProjectDetailChat,
  cli: () => 'CLI Body!',
  explorer: ProjectDetailExplorer,
  notes: () => 'Notes Body!',
};

export const PROJECT_ROUTES: UiNavigationConfigItem = {
  icon: runeFactory('Projects'),
  label: 'Projects',
  path: PROJECTS_BASE_ROUTE,
  element: ProjectsRoot,
  children: [
    {
      label: 'Project List',
      path: '',
      icon: runeFactory('Project'),
      element: ProjectsList,
    },
    {
      label: '(Unnamed Project)', // Find a way to omit this.
      path: ':projectName',
      icon: runeFactory('Project'),
      element: () => createElement(ProjectGuard),
      children: PROJECTS_CHILD_TABS.map((props): UiNavigationConfigItem<ProjectTabPath> => ({
        ...props,
        element: projectElements[props.path as ProjectTabPath],
      })),
    }
  ]
};
