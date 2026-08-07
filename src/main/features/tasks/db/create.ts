import {
  TaskSerialisation,
  taskSerialisationSchema
} from "@/shared/features/user-tasks";
import { LogApi } from "@/main/shared";
import { taskDb } from "../schema";

export const createTask = (
  serialised: TaskSerialisation, { log }: LogApi
): Promise<TaskSerialisation> => log(
  `Create new task "${serialised.data.summary}"`,
  async () => {
    const insertion = taskSerialisationSchema.parse(serialised);
    const { inserted } = await taskDb.insert(insertion);
    return inserted;
  }
);
