import { trpcReact } from "@/renderer/libs/react-query";
import {
  taskEnvelopeCodec,
  TaskRich,
  taskRichSchema,
  taskSerialisationSchema
} from "@/shared/features/user-tasks";
import { envelopeCodecFactory } from "@/shared/schema";
import { skipToken } from "@tanstack/react-query";
import { useMemo } from "react";
import { getViewTasks } from "../utilities";
import { BreadcrumbActiveNavigationItem } from "@/renderer/shared/navigation";

// Use the rich envelope.
// Run the codec if applicable.

export const useTaskIpc = (taskId?: string) => {
  const { data, ...props } = trpcReact.tasks.readTask.useQuery(taskId ? taskId : skipToken);
  const decodedTask: TaskRich | undefined = data ? taskEnvelopeCodec.decode(data) : undefined;
  return {
    ...props,
    data: decodedTask,
  };
};
export const useTaskIpcIncomplete = (
  currentView: BreadcrumbActiveNavigationItem | undefined,
  viewNames: string[]
) => {
  const { data, ...props } = trpcReact.tasks.readIncomplete.useQuery();
  const viewTasks = useMemo(
    () => getViewTasks(
      data?.map(({ data }) => data) || [], currentView, viewNames
    ),
    [data, currentView, viewNames]
  );
  return {
    ...props,
    loading: props.isLoading,
    viewTasks,
  };
};
