import { createElement } from "react";
import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../svg-viewer/components";
import {
  ProjectDetailChat,
  ProjectDetailOverview,
  // ProjectDetail,
  ProjectGuard,
  ProjectsList,
  ProjectsRoot
} from "./components";
// import { ProjectsRoot } from "./components/Root";
// import { useParams } from "react-router-dom";
// import { useProjects } from "./hooks/all";
import {
  PROJECTS_BASE_ROUTE,
  PROJECTS_CHILD_TABS,
  ProjectTabPath
} from "./constants";
// import { ProjectGuard } from "./components/Guard";

const projectElements: Record<
  ProjectTabPath, React.ComponentType
> = {
  '': ProjectDetailOverview,
  chat: ProjectDetailChat,
  cli: () => 'CLI Body!',
  notes: () => 'Notes Body!',
};

// const projectElement = () => {
//   const { projectName } = useParams();
//   const { projects } = useProjects();
//   const project = projects?.find((project) => project.name === projectName);

//   console.log('routes', project, projects, projectName);

//   // if (!project) return `There is no project "${projectName}".`;

//   return createElement(ProjectDetail, { project });
// };

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
      // element: projectElement,
      children: PROJECTS_CHILD_TABS.map((props): UiNavigationConfigItem<ProjectTabPath> => ({
        ...props,
        element: projectElements[props.path as ProjectTabPath],
      })),
    }
  ]
};
