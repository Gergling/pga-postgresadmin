import { createElement } from "react";
import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../svg-viewer/components";
import { ProjectDetail, ProjectsList } from "./components";

export const PROJECT_ROUTES: UiNavigationConfigItem = {
  icon: runeFactory('Projects'),
  label: 'Projects',
  path: 'projects',
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
      icon: runeFactory('Project'), // Find a way to omit this.
      element: (props) => {
        console.log('props', props)
        return createElement(ProjectDetail, { projectName: 'john' });
      },
    }
  ]
};
