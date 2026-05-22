import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { ReleaseUpdate } from "@/renderer/features/release";
import { runeFactory } from "../svg-viewer/components";
import { AdminRoot } from "./components";
import { ADMIN_BASE_ROUTE } from "./constants";

export const ADMIN_ROUTES: UiNavigationConfigItem = {
  icon: runeFactory('Admin'),
  label: 'Admin',
  path: ADMIN_BASE_ROUTE,
  element: AdminRoot,
  children: [
    {
      label: 'Admin',
      path: '',
      icon: runeFactory('Admin'),
      element: ReleaseUpdate,
    },
    // {
    //   label: '(Unnamed Project)', // Find a way to omit this.
    //   path: ':projectName',
    //   icon: runeFactory('Project'),
    //   element: () => {
    //     const { projectName } = useParams();
    //     const { projects } = useProjects();
    //     const project = projects?.find((project) => project.name === projectName);

    //     if (!project) return `There is no project "${projectName}".`;

    //     return createElement(ProjectDetail, project);
    //   },
    // }
  ]
};
