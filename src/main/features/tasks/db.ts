import { firestore } from "firebase-admin";
import { mainFirebaseDb } from "../../libs/firebase";
import { UserTask } from "../../../shared/features/user-tasks/types";
import { createUserTask } from "./utils";
import { getUserTaskAudit } from "./audit";

const converter: firestore.FirestoreDataConverter<UserTask> = {
  toFirestore: (task) => task,
  fromFirestore(snapshot) {
    const data = snapshot.data();
    return createUserTask(data as UserTask);
  }
};

export const userTaskCollection = () => mainFirebaseDb
  .collection('user_tasks')
  .withConverter(converter);

export const fetchIncompleteUserTasks = async (): Promise<UserTask[]> => {
  const snapshot = await userTaskCollection()
    .where('status', '!=', 'done')
    .get();

  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const updateTask = async (taskId: string, newData: Partial<UserTask>): Promise<UserTask> => {
  // newData should have at least one property.
  const taskRef = userTaskCollection().doc(taskId);

  try {
    const result = await mainFirebaseDb.runTransaction(async (transaction) => {
      const taskDoc = await transaction.get(taskRef);
      const previousState = taskDoc.data();
      if (!previousState) throw new Error("Task not found");

      const auditEntry = getUserTaskAudit(previousState, newData);

      // Append to the TOP of the history array. This means it's easier to find
      // via [last, ...previous] or Array.prototype.find.
      const audit = [auditEntry, ...previousState.audit];

      const updatedState: UserTask = {
        ...previousState,
        ...newData,
        audit,
        updated: Date.now(),
      };

      transaction.update(taskRef, { ...updatedState });

      return updatedState;
    });
    return result;
  } catch (error) {
    console.error("Update Failed:", error);
    throw error;
  }
};
