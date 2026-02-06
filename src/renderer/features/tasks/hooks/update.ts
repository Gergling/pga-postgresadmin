import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useIpc } from '../../../shared/ipc';
import { UiUserTask } from '../types';

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { updateTask } = useIpc();

  return useMutation({
    // 1. The actual IPC call
    mutationFn: (
      { taskId, newData }: { taskId: string, newData: Partial<UiUserTask> }
    ) => updateTask(taskId, newData),

    // 2. Optimistic Update (The "Ghost" logic)
    onMutate: async (variables) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['tasks', variables.taskId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<UiUserTask[]>(['tasks']);
      const previousTask = queryClient.getQueryData<UiUserTask[]>(['tasks', variables.taskId]);

      // Optimistically update the cache
      queryClient.setQueryData<UiUserTask[]>(['tasks'], (old) => {
        return old?.map((task) => 
          task.id === variables.taskId 
            ? { ...task, ...variables.newData, view: 'transitioning' }
            : task
        );
      });
      queryClient.setQueryData<UiUserTask>(
        ['tasks', variables.taskId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            ...variables.newData,
            view: 'transitioning',
          };
        },
      );

      // Return context so we can rollback on failure
      return { previousTasks, previousTask };
    },

    // 3. Success: Sync with the real data from the Main process
    onSuccess: (response, variables) => {
      // TODO: Check if this item should continue to be in the current view.
      // If not, view should be set to "outdated".
      // For now we're keeping "edge".
      queryClient.setQueryData<UiUserTask[]>(['tasks'], (old) => {
        return old?.map((task): UiUserTask => 
          task.id === variables.taskId ? {
            ...task,
            ...response,
            view: 'edge'
          } : task
        );
      });
      queryClient.setQueryData<UiUserTask>(
        ['tasks', variables.taskId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            ...variables.newData,
            view: 'edge',
          };
        },
      );
    },

    // 4. Error: Rollback the Ghost state if the transaction failed
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
        queryClient.setQueryData(['tasks', variables.taskId], context.previousTask);
      }
      console.error("Task update failed:", err);
    },
  });
};
