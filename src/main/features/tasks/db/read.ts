import {
  TaskIpcReadParameters,
  TaskSerialisation,
  taskSerialisationSchema
} from "@/shared/features/user-tasks";
import { taskDb } from "../schema";
import { LogApi } from "@/main/shared";

export const readIncompleteTasks = async (
  { log }: LogApi
): Promise<TaskSerialisation[]> => log(
  `Reading incomplete tasks`,
  async () => {
    const all = await taskDb.db.findAsync({});
    return all.filter(
      ({ data: { status } }) => status !== 'done'
    ).map(record => taskSerialisationSchema.parse(record));
  }
);

export const readTask = async (
  taskId: string,
  { log }: LogApi
): Promise<TaskSerialisation> => log(
  `Reading task ${taskId}`,
  async () => {
    const record = await taskDb.findOne({ id: taskId });
    if (!record) throw new Error(`Task ${taskId} not found`);
    return taskSerialisationSchema.parse(record);
  }
);

export const read = async (
  params: TaskIpcReadParameters,
  logApi: LogApi
): Promise<TaskSerialisation[]> => {
  switch (params.type) {
    case 'id': return Promise.all([readTask(params.id, logApi)]);
    case 'incomplete': return readIncompleteTasks(logApi);
  }
};
