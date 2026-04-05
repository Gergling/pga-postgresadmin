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
  // const renderId = useRef(Math.random());

  const getProject = useCallback((projectName: string) => {
    // console.log(`!!! Calling getProject from render instance: ${renderId.current}`);
    // console.log('Current projects in this closure:', projects);
    return projects?.find((p) => p.name === projectName);
  }, [projects]);

  // console.log(`+++ RENDER [${renderId.current}] projects:`, !!projects);

  // useEffect(() => {
  //   console.log(`??? PROJECTS UPDATED [${renderId.current}]:`, !!projects);
  // })


  // useEffect(() => {
  //   console.log('=== Mounting')
  //   return () => console.log('--- Unmounting');
  // }, []);

  return { projects, getProject, refetchProjects: refetch };
};

export const useProjectNavigation = () => {
  const { subscribe } = useNavigationRegister();
  const { getProject, projects } = useProjects();

  useEffect(() => {
    // This is to make sure we have a displayable history of icons and labels
    // for specific projects.
    console.log('=== Navigation projects', !!projects)
    return subscribe(async ({ params: { projectName } }) => {
      // Bug: This runs after projects has loaded, but projects is
      // undefined by that point. Why?
      console.log('=== Subscribe called', !!projects)
      if (!projectName) throw new Error('No project name found');
      // const project = getProject(projectName);
      const project = projects?.find((p) => p.name === projectName);
      if (!project) throw new Error(
        `No project found with name: ${projectName}`
      );

      console.log('project item registered for', project)

      return getProjectHistoryItem(project);
    });
  }, [getProject, subscribe, projects]);
};

