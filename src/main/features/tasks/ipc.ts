import { fetchIncompleteUserTasks, fetchUserTask, updateTask } from "./db";
import { TasksIpc } from "../../../shared/features/user-tasks/types";

export const tasksIpc = (): TasksIpc => {
  return {
    // create
    read: {
      forId: fetchUserTask,
      incomplete: fetchIncompleteUserTasks,
    },
    update: {
      set: updateTask
    }
    // delete
  };
};
