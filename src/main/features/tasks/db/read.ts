import { TaskSerialisation, taskSerialisationSchema } from "@/shared/features/user-tasks";
import { taskDb } from "../schema";

export const readIncompleteTasks = async (): Promise<TaskSerialisation[]> => {
  const all = await taskDb.db.findAsync({});
  return all.filter(
    ({ data: { status } }) => status !== 'done'
  ).map(record => taskSerialisationSchema.parse(record));
};

export const readTask = async (taskId: string): Promise<TaskSerialisation> => {
  const record = await taskDb.findOne({ id: taskId });
  if (!record) throw new Error(`Task ${taskId} not found`);
  return taskSerialisationSchema.parse(record);
};

// export const fetchRecentDiaryEntries = async (): Promise<DiaryEntrySerialisation[]> => {
//   try {
//     const recentSnapshot = await diaryDb.db.findAsync({
//       'data.status': { $in: ['processing', 'committed', 'draft'] }
//     });

//     const fillerSnapshot = recentSnapshot.length < recentDiaryCountFiller
//       ? await diaryDb.db.findAsync({
//         'id': {
//           $nin: recentSnapshot.map(doc => doc.id)
//         }
//       }).sort({
//         created: -1
//       }).limit(recentDiaryCountFiller - recentSnapshot.length) : [];

//     const entries = [...recentSnapshot, ...fillerSnapshot].map(
//       (item) => diaryEntrySerialisationSchema.parse(item)
//     );

//     // Sort by descending created date.
//     return entries.sort((a, b) => {
//       if (a.created === b.created) return 0;
//       const aZdt = dateSerialisationCodec.decode(a.created);
//       const bZdt = dateSerialisationCodec.decode(b.created);
//       return Temporal.ZonedDateTime.compare(bZdt, aZdt);
//     });
//   } catch (error) {
//     console.error("Fetch Failed:", error);
//     throw error;
//   }
// };