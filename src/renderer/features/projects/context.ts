import { PropsWithChildren, useMemo } from "react";
import { contextFactory } from "@gergling/ui-components";
import {
  ProjectEnvelope,
} from "@/shared/features/projects";
import { trpcReact } from "@/renderer/libs/react-query";

export const {
  Provider: ProjectDetailProvider,
  useContextHook: useProjectDetail,
} = contextFactory(
  (props: PropsWithChildren & { project: ProjectEnvelope; }) => {
    const {
      data,
      refetch,
    } = trpcReact.projects.fetchLocalStatus.useQuery(props.project.name, {
      enabled: false,
    });

    const project = useMemo(
      (): ProjectEnvelope => props.project.from(data),
      [data, props.project]
    );

    return {
      project,
      projectRefreshLocal: refetch,
    };
  },
  'project-detail'
);
