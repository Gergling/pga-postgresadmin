import {
  TaskCore,
  TaskSerialisation,
  taskSerialisationSchema
} from "@/shared/features/user-tasks";
import { log, LogApi } from "@/main/shared";
import { taskDb } from "../schema";
import { serialisationDateSchema } from "@/shared/schema";
import { readTask } from "./read";

export const updateTask = (
  taskId: string, newData: Partial<TaskCore>, { log }: LogApi
): Promise<TaskSerialisation> => log(`Update task ${taskId}`, async () => {
  // taskDb.callback(
  //   // TODO: set function can update audit and queue sync.
  //   ({ q, set, update }) => update(q({ id: taskId }), set({ ...newData }))
  // );
  const record = await readTask(taskId);
  const { data } = record;
  // const audit = getUserTaskAudit(data, newData);

  const audit: TaskSerialisation['audit'] = [
    {
      updated: serialisationDateSchema.parse({}),
      data: newData
    },
    ...record.audit
  ];
  const set = taskSerialisationSchema.parse({
    ...record,
    audit,
    data: {
      ...data,
      ...newData,
    },
  });

  await taskDb.update({ id: taskId }, set);
  return set;
  // // newData should have at least one property.
  // const taskRef = userTaskCollection().doc(taskId);

  // try {
  //   const result = await getFirebaseDb().runTransaction(async (transaction) => {
  //     const taskDoc = await transaction.get(taskRef);
  //     const previousState = taskDoc.data();
  //     if (!previousState) throw new Error("Task not found");

  //     const auditEntry = getUserTaskAudit(previousState, newData);

  //     // Append to the TOP of the history array. This means it's easier to find
  //     // via [last, ...previous] or Array.prototype.find.
  //     const audit = [auditEntry, ...previousState.audit];

  //     const updatedState: UserTaskDb = updateUserTask({
  //       ...previousState,
  //       ...newData,
  //       audit,
  //       id: taskRef.id,
  //       updated: Date.now(),
  //     });

  //     transaction.update(taskRef, { ...updatedState });

  //     return updatedState;
  //   });
  //   return result;
  // } catch (error) {
  //   console.error("Update Failed:", error);
  //   throw error;
  // }
});
