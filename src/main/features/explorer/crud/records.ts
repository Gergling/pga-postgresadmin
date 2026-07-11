import { resolve } from "path";
import { nowUTCMs } from "@/shared/utilities";
import {
  ExplorerFileRecord,
  ExplorerFileRecordProps,
  explorerFileRecordSchema,
  parentPathSchema
} from "@/shared/features/explorer";
import { LogApi } from "@/main/shared";
import { explorerFileRecords } from "../schema";

const db = explorerFileRecords.db;

export const readAllExplorerRecords = () => db.findAsync({});

// TODO: If this operation takes a long time, we should mark as "heavy duty"
export const cleanExplorerFileRecords = async ({ log }: LogApi) => {
  await log('Fixing schema violations', () => explorerFileRecords.fixSchemaViolations(explorerFileRecordSchema, ({ error, record }, idx) => {
    const shouldRemove = error.issues.every((issue) => {
      if (issue.code === 'invalid_type') {
        if (issue.expected === 'string') {
          return issue.path.includes('parentPath') || issue.path.includes('name');
        }
      }
      return false;
    });
    if (shouldRemove) return 'delete';
    // if (idx < 10) console.log('VIOLATION', error, record)
    console.log('VIOLATION', error, record)
    return 'ignore';
  }));

  const all = await log('Handling dupes', async ({ log }) => {
    const all = await log('Reading all explorer records', readAllExplorerRecords);

    const { duplicates } = all.reduce((acc, data) => {
      const key = `${data.parentPath}/${data.name}`;
      const count = (acc.counts[key] || 0) + 1;

      return {
        ...acc,
        counts: {
          ...acc.counts,
          [key]: count
        },
        duplicates: [...acc.duplicates, ...(count === 2 ? [data] : [])],
      };
    }, { counts: {} as Record<string, number>, duplicates: [] as ExplorerFileRecordProps[] });

    await log(
      `Removing ${duplicates.length} duplicate keys`,
      async ({ log, setMessage, setStatus }) => {
        const sums = await Promise.all(
          duplicates.map(
            ({ name, parentPath }) => log(
              `${parentPath}/${name}`, () => db.removeAsync({ name, parentPath }, { multi: true })
            )
          )
        );
        const sum = sums.reduce((acc, sum) => acc + sum, 0);
        if (sum > 0) {
          setStatus('information');
          setMessage(`Removed ${sum} duplicate records.`);
        }
      }
    );

    return all;
  });

  // Delete orphans.
  await log('Handling orphans', async () => {
    // Use `all`.
    // await log(
    //   `Removing ${duplicates.length} duplicates`,
    //   async ({ log }) => Promise.all(
    //     duplicates.map(
    //       ({ data: { name, parentPath }, path }) => log(
    //         path, () => db.removeAsync({ name, parentPath }, { multi: true })
    //       )
    //     )
    //   )
    // );
  });
};

export const readOldestParentPath = async () => {
  const [result] = await db.findAsync({
    parentPath: { $exists: true }
  }).sort({ updated: 1 }).limit(1);
  if (result && result.parentPath) return result.parentPath;

  return '/';
};

// Activity Check (timeout): Find a records with a created time in the last [timeout]
// or an audit element in the last [timeout]. This simply returns the records
// ordered by the oldest changes in the last [timeout].
export const readActivity = async (timeout: number) => db.findAsync({
  updated: { $gte: nowUTCMs() - timeout },
}).sort({ updated: 1 });

export const readScannable = async (
  limit: number, isDirectory: boolean
) => {
  const scannables = await db.findAsync({
    action: 'scan',
    isDirectory,
  }).sort({ updated: 1 }).limit(limit);
  // console.log('SCANNABLES', scannables)
  return explorerFileRecordSchema.array().parse(scannables);
}

export const readPathRecords = (
  name: string, parentPath: string
  // TODO: We can mark dupes here.
) => db.findOneAsync({ name, parentPath: parentPathSchema.parse(parentPath) });
export const readExplorerRecords = db.findAsync;

type Params = Partial<ExplorerFileRecordProps>;
export const updateExplorerFileRecords = async (
  parentPath: string, names: string[],
  set: Params
) => {
  const updated = nowUTCMs();
  return db.updateAsync({
    name: { $in: names }, parentPath: { $eq: parentPathSchema.parse(parentPath) }
  }, { $set: { ...set, updated } }, { upsert: true });
};

export const insertExplorerFileRecords = async (
  inserts: ExplorerFileRecordProps[]
) => {
  // const updated = nowUTCMs();
  const records = inserts.map((insert) => new ExplorerFileRecord(insert).data);
  return db.insertAsync(records);
};
