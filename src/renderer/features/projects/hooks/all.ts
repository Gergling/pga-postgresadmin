import { useCallback, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIpc } from "@/renderer/shared/ipc";
import {
  useNavigationRegister
} from "@/renderer/shared/navigation";
import { getProjectHistoryItem } from "../utilities";

export const useProjects = () => {
  const { fetchProjectsList } = useIpc();
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjectsList(),
  });

  // NOTE: The moment we want to customise project metadata, this becomes
  // irrelevant.
  const getProject = useCallback((projectName: string) => {
    return projects?.find((project) => project.name === projectName);
  }, [projects]);

  return { projects, getProject };
};

// import { createUiUserTask, getTaskHistoryItem } from "../utilities";

// const reduceTaskView = (
//   acc: TaskView[],
//   item: UiNavigationConfigItem
// ): TaskView[] => {
//   const { icon, label, path } = item;
//   if (!icon || !label || !path) return acc;
//   return [ ...acc, { icon, label, path }];
// };

export const useProjectNavigation = () => {
  const { subscribe } = useNavigationRegister();
  const { getProject, projects } = useProjects();

  console.log('useProjectNavigation');

  useEffect(() => {
    console.log('useProjectNavigation useEffect', projects, getProject('postgresadmin'));
    // This is to make sure we have a displayable history of icons and labels
    // for specific projects.
    return subscribe(async ({ params: { projectName }, pathname }) => {
      console.log('useProjectNavigation subscribe', projectName, pathname);
      if (!projectName) throw new Error('No project name found');
      const project = getProject(projectName);
      console.log('useProjectNavigation subscribe project', project);
      if (!project) throw new Error(
        `No project found with name: ${projectName}`
      );

      return getProjectHistoryItem(project);
    });
  }, [getProject, subscribe]);
};

