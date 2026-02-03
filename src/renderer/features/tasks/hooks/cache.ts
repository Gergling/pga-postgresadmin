import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UiUserTask } from "../types";

export const useTaskQueryCache = (
  success: boolean,
  task?: UiUserTask,
) => {
  const queryClient = useQueryClient();

  const updated = useMemo(() => {
    if (success && task) {
      queryClient.setQueryData<UiUserTask[]>(['tasks'], (tasks) => {
        return tasks?.map((item): UiUserTask => 
          item.id === task?.id ? {
            ...item,
            ...task,
          } : item
        );
      });

      return true;
    }

    return false;
  }, [success, task]);

  return updated;
};