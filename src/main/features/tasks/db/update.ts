import {
  TaskCoreSerialised,
  taskFactory,
  TaskSerialisation,
  taskSerialisationSchema
} from "@/shared/features/user-tasks";
import { LogApi } from "@/main/shared";
import { taskDb } from "../schema";
import { readTask } from "./read";

export const updateTask = (
  taskId: string, newData: Partial<TaskCoreSerialised>, { log }: LogApi
): Promise<TaskSerialisation> => log(`Update task ${taskId}`, async (logApi) => {
  const record = await readTask(taskId, logApi);
  const existing = taskFactory
    .fromDb(record)
    .updateData(taskFactory.fromSerialisedCore(newData).data.updated);

  const set = taskSerialisationSchema.parse(existing.serialise());

  await taskDb.update({ id: taskId }, set);
  return set;
});
