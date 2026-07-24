import {
  TaskSerialisation,
  taskSerialisationSchema
} from "@/shared/features/user-tasks";
import { setupCollection } from "@/main/libs/database";

export const { local: taskDb, remote: taskDbRemote } = setupCollection<TaskSerialisation>(
  'tasks',
  taskSerialisationSchema
);
