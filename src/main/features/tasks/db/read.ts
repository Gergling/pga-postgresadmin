import {
  COUNCIL_MEMBER,
  TaskIpcReadParameters,
  TaskSerialisation,
  taskSerialisationSchema,
  VOTE_PROPS,
  votePropsNameSchema
} from "@/shared/features/user-tasks";
import { taskDb } from "../schema";
import { LogApi } from "@/main/shared";
import { getObjectKeys } from "@/shared/utilities";

const votePropsList = getObjectKeys(VOTE_PROPS);

const filterIncomplete = { 'data.status': { $nin: ['done', 'rejected'] } };
const filterAwaitingVotes = COUNCIL_MEMBER.filter(({ name }) => ![
  // Councillors not implemented yet:
  'guardian', 'philosopher', 'architect', 'strategist', 'diplomat', 'sceptic',
].includes(name)).map(
  ({ name }) => ({
    ...votePropsList.reduce(
      (acc, prop) => ({
        ...acc,
        [`data.votes.${prop}.${name}`]: 'Awaiting',
      }), {},
    )
  }), {}
);

export const readIncompleteAwaitingTasks = async (
  { log }: LogApi
): Promise<TaskSerialisation[]> => log(
  `Reading incomplete tasks awaiting votes`,
  async () => {
    const all = await taskDb.db.findAsync({
      $and: [
        filterIncomplete,
        { $or: filterAwaitingVotes }
      ]
    });
    return all.map(record => taskSerialisationSchema.parse(record));
  }
);

export const readIncompleteTasks = async (
  { log }: LogApi
): Promise<TaskSerialisation[]> => log(
  `Reading incomplete tasks`,
  async () => {
    const all = await taskDb.db.findAsync(filterIncomplete);
    return all.map(record => taskSerialisationSchema.parse(record));
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
