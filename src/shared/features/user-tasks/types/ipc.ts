import { UserTask } from "./task";

export type TasksIpc = {
  // create
  read: {
    incomplete: () => Promise<UserTask[]>;
  };
  update: {
    set: (taskId: string, newData: Partial<UserTask>) => Promise<UserTask>;
  };
  // delete
};
