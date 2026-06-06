import { contextFactory } from "@gergling/ui-components";
import { PropsWithChildren, useMemo } from "react";
import {
  projectCodec,
  ProjectRenderer
} from "@/shared/features/projects";
import { trpcReact } from "@/renderer/libs/react-query";

export const {
  Provider: ProjectDetailProvider,
  useContextHook: useProjectDetail,
} = contextFactory(
  (props: PropsWithChildren & { project: ProjectRenderer; }) => {
    const {
      data,
      refetch,
    } = trpcReact.projects.fetchLocalStatus.useQuery(props.project.name, {
      enabled: false,
    });

    const project = useMemo((): ProjectRenderer => {
      const projectData = data ? projectCodec.decode(data) : props.project;
      return { ...props.project, ...projectData };
    }, [data, props.project]);

    return {
      project,
      projectRefreshLocal: refetch,
    };
  },
  'project-detail'
);
