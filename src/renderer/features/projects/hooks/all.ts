import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  // console.log('+++ RENDER projects', projects)

  // NOTE: The moment we want to customise project metadata, this becomes
  // irrelevant.
  const renderId = useRef(Math.random().toString(36).substring(7));

  const getProject = useCallback((projectName: string) => {
    console.log(`!!! [${renderId.current}] Calling getProject:`, !!projects);
    // console.log('Current projects in this closure:', projects);
    return projects?.find((p) => p.name === projectName);
  }, [projects]);

  console.log(`+++ [${renderId.current}] RENDER projects:`, !!projects);

  useEffect(() => {
    console.log(`??? [${renderId.current}] PROJECTS UPDATED:`, !!projects);
  })


  useEffect(() => {
    console.log(`=== [${renderId.current}] Mounting`)
    return () => console.log(`--- [${renderId.current}] Unmounting`);
  }, []);

  return { projects, getProject, refetchProjects: refetch };
};

export const useProjectNavigation = () => {
  const { subscribe } = useNavigationRegister();
  const { getProject, projects } = useProjects();

  useEffect(() => {
    const effectId = Math.random().toString(36).substring(7);
    // This is to make sure we have a displayable history of icons and labels
    // for specific projects.
    console.log(`[${effectId}] === Navigation projects init`, !!projects)
    const result = subscribe(async ({ params: { projectName } }) => {
      // Bug: This runs after projects has loaded, but projects is
      // undefined by that point. Why?
      console.log(`[${effectId}] === Subscribe callback executed`, !!projects)
      if (!projectName) throw new Error('No project name found');
      // const project = getProject(projectName);
      const project = projects?.find((p) => p.name === projectName);
      if (!project) {
        console.error(`[${effectId}] No project found with name: ${projectName}. Projects available:`, projects?.length);
        throw new Error(
          `No project found with name: ${projectName}`
        );
      }

      console.log(`[${effectId}] project item registered for`, project.name)

      return getProjectHistoryItem(project);
    });

    return () => {
      console.log(`[${effectId}] === Cleaning up subscription from effect ${effectId}`);
      if (typeof result === 'function') {
        result();
      } else if (result && typeof (result as any).then === 'function') {
        console.warn(`[${effectId}] subscribe returned a Promise! React useEffect cleanup must be synchronous, so this subscription will NOT be cleaned up correctly.`);
      }
    };
  }, [getProject, subscribe, projects]);
};

