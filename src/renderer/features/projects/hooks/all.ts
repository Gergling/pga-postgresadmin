import { useCallback, useEffect, useMemo } from "react";
import {
  useNavigationRegister
} from "@/renderer/shared/navigation";
import { trpcReact } from "@/renderer/libs/react-query";
import { getProjectHistoryItem } from "../utilities";
import { projectCodec } from "@/shared/features/projects";

export const useProjects = () => {
  const {
    data,
    refetch,
  } = trpcReact.projects.fetchList.useQuery();

  const projects = useMemo(() => {
    return data?.map(
      (project) => {
        return projectCodec.decode(project);
      }
    )
  }, [data])

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

