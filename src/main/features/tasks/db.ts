import { firestore } from "firebase-admin";
import { mainFirebaseDb } from "../../libs/firebase";
import { UserTask } from "../../../shared/features/user-tasks/types";
import { createUserTask } from "./utils";
// import { getUserTaskAudit } from "./audit";

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

// export const updateTask = async (taskId: string, newData: Partial<UserTask>) => {
//   const taskRef = userTaskCollection().doc(taskId);

//   try {
//     await mainFirebaseDb.runTransaction(async (transaction) => {
//       const taskDoc = await transaction.get(taskRef);
//       const previousState = taskDoc.data();
//       if (!previousState) throw new Error("Task not found");

//       const auditEntry = getUserTaskAudit(previousState);

//       // Append to the TOP of the history array
//       const audit = [auditEntry, ...previousState.audit];

//       const updatedState: UserTask = {
//         ...previousState,
//         ...newData,
//         audit,
//         updated: Date.now(),
//       };

//       transaction.update(taskRef, { ...updatedState });
//     });
//     return { success: true };
//   } catch (error) {
//     console.error("Update Failed:", error);
//     return { success: false, error };
//   }
// };
