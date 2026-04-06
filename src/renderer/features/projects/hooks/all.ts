import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useIpc } from "@/renderer/shared/ipc";
import {
  useNavigationRegister
} from "@/renderer/shared/navigation";
import { getProjectHistoryItem } from "../utilities";

export const useProjects = () => {
  const { fetchProjectsList } = useIpc();
  const { data: projects, refetch } = useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchProjectsList(),
  });

  const getProject = useCallback(
    (projectName: string) => projects?.find((p) => p.name === projectName),
    [projects]
  );

  return { projects, getProject, refetchProjects: refetch };
};

// This is to make sure we have a displayable history of icons and labels
// for specific projects.
export const useProjectNavigation = () => {
  const { register, subscribe } = useNavigationRegister();
  const { getProject, projects } = useProjects();

  useEffect(() => {
    if (projects) {
      projects.forEach((project) => {
        register(getProjectHistoryItem(project));
      });
    }
  }, [projects, register]);

  useEffect(() => {
    if (projects) {
      return subscribe(async ({ params: { projectName } }) => {
        if (!projectName) throw new Error('No project name found');
        const project = getProject(projectName);
        if (!project) {
          console.error(`No project found with name: ${projectName}. Projects available:`, projects?.length);
          throw new Error(
            `No project found with name: ${projectName}`
          );
        }

        return getProjectHistoryItem(project);
      });
    }
  }, [projects, subscribe]);
};

