import { useCallback, useEffect, useMemo } from "react";
import {
  useNavigationRegister
} from "@/renderer/shared/navigation";
import { trpcReact } from "@/renderer/libs/react-query";
import { getProjectHistoryItem } from "../utilities";
import { projectCodec, ProjectEnvelope } from "@/shared/features/projects";

export const useProjects = () => {
  const {
    data,
    refetch,
    isLoading: readListIsLoading
  } = trpcReact.projects.readList.useQuery();
  const {
    mutateAsync,
    isPending: updateRootIsLoading
  } = trpcReact.projects.updateRoot.useMutation();
  const utils = trpcReact.useUtils();

  const projects = useMemo(() => ProjectEnvelope.from(data), [data]);

  // Each project needs to be updated individually for additional information.
  // The ones with git "unknown" can just be handled right now.
  // For that matter, just do it on the backend.
  // We can think about auxiliary updates to old projects later, but we won't
  // want an audit logged if nothing has changed, so the only thing that will
  // change will be the git.lastCheck or something.
  // Then we can just order by that and check the top one.

  const getProject = useCallback(
    (projectName: string) => projects?.find((p) => p.name === projectName),
    [projects]
  );

  const isLoading = useMemo(
    () => readListIsLoading || updateRootIsLoading,
    [readListIsLoading, updateRootIsLoading]
  );

  const updateRoot = useCallback(
    () => mutateAsync().then(() => utils.projects.readList.invalidate()),
    [utils.projects.readList.invalidate, mutateAsync]
  );

  return {
    isLoading, getProject, projects, refetchProjects: refetch, updateRoot
  };
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

