import {
  TaskSerialisation,
  taskSerialisationSchema,
} from "@/shared/features/user-tasks";
import { tRPC } from "@/main/config";
// import { fetchIncompleteUserTasks, fetchUserTask, updateTask } from "./db/db";
import { TasksIpc } from "../../../shared/features/user-tasks/types";
import { readIncompleteTasks, readTask, updateTask } from "./db";
import { log } from "@/main/shared";
import z from "zod";

// export const tasksIpc = (): TasksIpc => {
//   return {
//     // create
//     read: {
//       forId: fetchUserTask,
//       incomplete: fetchIncompleteUserTasks,
//     },
//     update: {
//       set: updateTask
//     }
//     // delete
//   };
// };

export const tasksRouter = tRPC.router({
  readIncomplete: tRPC.procedure.query(
    (): Promise<TaskSerialisation[]> => log(
      `RPC(tasks:readIncomplete)`,
      () => readIncompleteTasks()
    ),
  ),
  readTask: tRPC.procedure.input(z.string()).query(
    ({ input }) => log(
      `RPC(tasks:readTask: ${input})`,
      () => readTask(input)
    ),
  ),
  update: tRPC.procedure.input(taskSerialisationSchema).mutation(
    ({ input }) => log(
      `RPC(tasks:update: ${input.id})`,
      (logApi) => updateTask(input.id, input.data, logApi)
    ),
  ),
  // fetchRecent: tRPC.procedure.query(() => fetchRecentDiaryEntries()),
});

