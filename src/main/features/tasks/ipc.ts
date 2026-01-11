import { fetchIncompleteUserTasks, updateTask } from "./db";
import { TasksIpc } from "../../../shared/features/user-tasks/types";

export const tasksIpc = (): TasksIpc => {
  return {
    // create
    read: {
      incomplete: fetchIncompleteUserTasks,
    },
    update: {
      set: updateTask
    }
    // delete
  };
};
