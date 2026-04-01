import { createElement } from "react";
import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../svg-viewer/components";
import { ProjectDetail, ProjectsList } from "./components";
import { ProjectsRoot } from "./components/Root";
import { useParams } from "react-router-dom";
import { useProjects } from "./hooks/all";

export const PROJECT_ROUTES: UiNavigationConfigItem = {
  icon: runeFactory('Projects'),
  label: 'Projects',
  path: 'projects',
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
      element: () => {
        const { projectName } = useParams();
        const { projects } = useProjects();
        const project = projects?.find((project) => project.name === projectName);

        if (!project) return `There is no project "${projectName}".`;

        return createElement(ProjectDetail, project);
      },
    }
  ]
};
