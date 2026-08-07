import z from "zod";
import {
  taskIpcReadParametersSchema,
  TaskSerialisation,
  taskSerialisationSchema,
} from "@/shared/features/user-tasks";
import { tRPC } from "@/main/config";
import { log } from "@/main/shared";
import { createTask, read, readIncompleteTasks, readTask, updateTask } from "./db";

export const tasksRouter = tRPC.router({
  create: tRPC.procedure.input(taskSerialisationSchema).mutation(
    ({ input }) => log(
      `RPC(tasks:create: ${input.id})`,
      (logApi) => createTask(input, logApi)
    ),
  ),
  /**
   * @deprecated Use {@link read} with params type set to 'incomplete'.
   */
  readIncomplete: tRPC.procedure.query(
    (): Promise<TaskSerialisation[]> => log(
      `RPC(tasks:readIncomplete)`,
      readIncompleteTasks
    ),
  ),
  /**
   * @deprecated Use {@link read} with params type set to 'id'.
   */
  readTask: tRPC.procedure.input(z.string()).query(
    ({ input }) => log(
      `RPC(tasks:readTask: ${input})`,
      (logApi) => readTask(input, logApi)
    ),
  ),
  read: tRPC.procedure.input(taskIpcReadParametersSchema).query(
    ({ input }) => log(
      `RPC(tasks:read)`,
      (logApi) => read(input, logApi)
    ),
  ),
  update: tRPC.procedure.input(taskSerialisationSchema).mutation(
    ({ input }) => log(
      `RPC(tasks:update: ${input.id})`,
      (logApi) => updateTask(input.id, input.data, logApi)
    ),
  ),
});

