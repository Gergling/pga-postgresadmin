import path from "path";
import { Mandatory } from "@/shared/types";
import { nowUTCMs } from "@/shared/utilities";
import {
  ExplorerFileRecord,
  ExplorerFileRecordAction,
  explorerFileRecordSchema,
  ExplorerFileRecordPayload,
  ExplorerFileRecordProps,
  ExplorerFileRecordQuery,
  explorerFileRecordQuerySchema,
  explorerParentPathSchema
} from "@/shared/features/explorer";
import { fileExists, LogApi } from "@/main/shared";
import { explorerFileRecords } from "../schema";
import { ACTION_TRAVERSAL_PRIORITY } from "./constants";

const db = explorerFileRecords.db;

export const readAllExplorerRecords = async ({ log, setStatus }: LogApi) => {
  // TODO: Set as debug level.
  const records = await log('Reading all explorer records', () => db.findAsync({}));
  setStatus('information', `Read ${records.length} records.`);
  return records;
};

// const searchBackfillEligiblePathsByAction = async (
//   action: ExplorerFileRecordAction, updated: number
// ): Promise<ExplorerFileRecord | undefined> => {
//   const [result] = await db.findAsync({
//     action, parentPath: { $exists: true }
//   }).sort({ updated }).limit(10);
//   // console.log('WTF?!', result);
//   if (!result) return;
//   return new ExplorerFileRecord(result);
// };

// Look for directory paths:
// Find the deepest (both new and old if there's joint).
// Find the oldest.
// Find the newest.
// const sortNames = ['age', 'depth', 'recency'] as const;
// type SortName = typeof sortNames[number];
// type BackfillOptions = Record<SortName, ExplorerFileRecord>;

// const comparators: Record<SortName,
//   (a: ExplorerFileRecord, b: ExplorerFileRecord) => number
// > = {
//   age: (a, b) => a.data.updated - b.data.updated,
//   depth: (a, b) => a.depth - b.depth,
//   recency: (a, b) => b.data.updated - a.data.updated,
// };
// export const searchBackfillEligiblePaths = async ({ log }: LogApi) => log(
//   `Searching for eligible backfill path`,
//   async () => {
//     // A record that hasn't been updated in a while. Sort oldest.
//     // A directory record with an undefined usage.
//     // Perhaps find the deepest directory with an undefined usage.
//     // Find the most recently updated record. If it's a leaf, check the parent. If the usage is undefined, this is the directory.
//     const all = await db.findAsync({});
//     const records = all.map((data) => new ExplorerFileRecord(data));
//     const lists = sortNames.reduce(
//       (lists, name) => {
//         const sorted = records.sort(comparators[name]);
//         return { ...lists, [name]: sorted };
//       },
//       {} as BackfillOptions
//     );
//     // const ordered = all.reduce((acc, data) => {
//     //   const record = new ExplorerFileRecord(data);
//     //   // const idx = comparators.findIndex(
//     //   //   (comparator, idx) => acc.length > idx && comparator(record, acc[idx])
//     //   // );
//     //   return [
//     //     ...acc.slice(0, idx),
//     //     record,
//     //     ...acc.slice(idx + 1)
//     //   ]
//     // }, [] as ExplorerFileRecord[]);
//     // console.log('ORDERED', ordered)

//     // console.log('WTF?!', wtf);
//     for (const order of [1, -1]) {
//       const direction = order === -1 ? 'descending' : 'ascending';
//       for (const action of ACTION_TRAVERSAL_PRIORITY) {
//         const result = await log(
//           `Direction: ${direction}, Action: ${action}`,
//           () => searchBackfillEligiblePathsByAction(action, order)
//         );
//         if (result) {
//           if (result.data.isDirectory) return result.path;
//           return result.data.parentPath;
//         }
//       }
//     }

//     return '/';
//   }
// );

export const mapRecords = async (
  cb: () => ReturnType<typeof db.findAsync>
): Promise<ExplorerFileRecord[]> => {
  const records = await cb();
  return records.map((data) => new ExplorerFileRecord(data));
};

// Activity Check (timeout): Find a records with a created time in the last [timeout]
// or an audit element in the last [timeout]. This simply returns the records
// ordered by the oldest changes in the last [timeout].
export const readActivity = async (timeout: number) => mapRecords(
  () => db.findAsync({
    updated: { $gte: nowUTCMs() - timeout },
  }).sort({ updated: 1 })
);
// export const readActivity = async (timeout: number) => {
//   const records = await db.findAsync({
//     updated: { $gte: nowUTCMs() - timeout },
//   }).sort({ updated: 1 });
//   return records.map((data) => new ExplorerFileRecord(data));
// };

export const readScannable = async (
  limit: number, isDirectory: boolean
) => mapRecords(() => db.findAsync({
  action: 'scan',
  isDirectory,
}).sort({ updated: 1 }).limit(limit));
// export const readScannable = async (
//   limit: number, isDirectory: boolean
// ) => {
//   const scannables = await db.findAsync({
//     action: 'scan',
//     isDirectory,
//   }).sort({ updated: 1 }).limit(limit);
//   // console.log('SCANNABLES', scannables)
//   return explorerFileRecordSchema.array().parse(scannables);
// }

export const readPathRecords = async (
  name: string, parentPath: string, { log }: LogApi
): Promise<ExplorerFileRecordProps | null> => {
  const result = await db.findOneAsync({ name, parentPath: explorerParentPathSchema.parse(parentPath) });
  if (result && result.updated === nowUTCMs() - (1000 * 60 * 60)) {
    log(
      'Record is more than an hour old. Checking for existence',
      async ({ setStatus }) => {
        const record = new ExplorerFileRecord(result);
        const exists = await fileExists(record.path);
        if (!exists) {
          const removed = await db.removeAsync(
            { name, parentPath: explorerParentPathSchema.parse(parentPath) },
            { multi: true }
          );
          setStatus('information', `Removed ${removed} orphan records.`);
        }
      }
    );
  }
  return result;
};
// export const readExplorerRecords = db.findAsync;
export const readChildExplorerRecords = async (
  parentPath: string
) => mapRecords(() => db.findAsync({ parentPath }));

type Params = Partial<ExplorerFileRecordProps>;
// export const updateExplorerFileRecords = async (
//   parentPath: string, nameParam: string | string[],
//   set: Params, { log }: LogApi
// ) => {
//   const names = Array.isArray(nameParam)
//     ? nameParam
//     : [nameParam];
//   return log(`Updating ${names.length} records with parent`, async ({ setStatus }) => {
//     if (set.action === 'traverse') {
//       const allPerflogs = await db.findAsync({ name: 'PerfLogs' });
//       console.log('HERE?', parentPath, names, set, allPerflogs)
//     }
//     console.log('UPDATE', names, set.name)
//     const updated = nowUTCMs();
//     const report = await db.updateAsync({
//       name: { $in: names }, parentPath: parentPathSchema.parse(parentPath)
//     }, { $set: { ...set, updated } }, { upsert: true });
//     setStatus('information', `Upserted ${report.numAffected} records`);
//     return report;
//   });
// }

// export const insertExplorerFileRecords = async (
//   inserts: ExplorerFileRecordProps[], { log }: LogApi
// ) => log(`Inserting ${inserts.length} records`, ({ setStatus }) => {
//   // const updated = nowUTCMs();
//   const records = inserts.map((insert) => new ExplorerFileRecord(insert).data);
//   setStatus('information', `Inserted ${inserts.length} records`);
//   return db.insertAsync(records);
// });

// type QueryKey = 'name' | 'parentPath';
// type UpdateQueryParams = Pick<ExplorerFileRecordProps, QueryKey>;
// type UpdateSetParams = Omit<ExplorerFileRecordProps, QueryKey>;

// type UpsertExplorerFileRecordsParams = {
//   logApi: LogApi;
// } & (
//     {
//       type: 'insert';
//       data: ExplorerFileRecordProps[];
//     } | (
//       {
//         type: 'update';
//         parentPath: string; names: string | string[];
//         set: Partial<UpdateSetParams>;
//       } | {
//         type: 'upsert';
//         parentPath: string; names: string | string[];
//         set: Mandatory<UpdateSetParams, 'isDirectory'>;
//       }
//     )
//   );
// type UpsertExplorerFileRecordsReturn = {
//   type: 'insert';
//   data: {
//     query?: undefined;
//     set: ExplorerFileRecordProps;
//   }[];
// } | {
//   type: 'update';
//   data: {
//     query: UpdateQueryParams;
//     set: Partial<UpdateSetParams>;
//   }[];
// } | {
//   type: 'upsert';
//   data: {
//     query: UpdateQueryParams;
//     set: Mandatory<UpdateSetParams, 'isDirectory'>;
//   }[];
// };

// const getRecordsFromParams = (
//   params: UpsertExplorerFileRecordsParams
// ): UpsertExplorerFileRecordsReturn => {
//   switch (params.type) {
//     case 'insert': return {
//       data: params.data.map(
//         (data) => ({ set: new ExplorerFileRecord(data).data })
//       ),
//       type: params.type,
//     };
//     case 'update': {
//       const names = Array.isArray(params.names) ? params.names : [params.names];
//       const data = names.map((name) => ({
//         query: { name, parentPath: params.parentPath },
//         set: params.set,
//       }));
//       return { data, type: params.type };
//     }
//     case 'upsert': {
//       const names = Array.isArray(params.names) ? params.names : [params.names];
//       const data = names.map((name) => ({
//         query: { name, parentPath: params.parentPath },
//         set: params.set,
//       }));
//       return { data, type: params.type };
//     }
//   }
// };

type UpsertExplorerFileRecordParamsSet =
  | Partial<ExplorerFileRecordPayload>
  | Mandatory<ExplorerFileRecordPayload, 'isDirectory'>
  ;

// explorerFileRecordQuerySchema
export const upsertExplorerFileRecords = async (
  query: ExplorerFileRecordQuery | ExplorerFileRecordQuery[],
  $set: UpsertExplorerFileRecordParamsSet,
  logApi: LogApi,
) => {
  const queries = Array.isArray(query) ? query : [query];
  const { log, setStatus } = logApi;
  const upsert = $set.isDirectory !== undefined;
  if (queries.length) {
    const result = await log(
      `Updating ${queries.length} records to ${JSON.stringify($set)}`,
      async ({ log, setStatus }) => {
        const results = await Promise.all(queries.map((query) => {
          return log(
            `Updating ${query.name} for ${query.parentPath}`,
            ({ setStatus }) => {
              const parsedQuery = explorerFileRecordQuerySchema.parse(query);
              if (parsedQuery.parentPath !== query.parentPath) {
                setStatus('warning', `Parent path ${query.parentPath} transformed to ${parsedQuery.parentPath}`);
              }
              return db.updateAsync(parsedQuery, { $set }, { upsert });
            },
            // TODO: Ideally display this at a debug level.
          );
        }));
        const totalUpdated = results.reduce(
          (acc, { numAffected }) => acc + numAffected,
          0
        );
        setStatus('information', `Updated ${totalUpdated} records for ${upsert ? 'upsert' : 'update'}`);
        return totalUpdated;
      }
    );
    return result;
  }
  setStatus('warning', 'Attempted to upsert with no data.');
};

// export const removeExplorerFileRecords = async (
//   parentPath: string, name: string, { log }: LogApi
// ) => log(
//   `Removing explorer file records for ${parentPath}/${name}`,
//   async ({ setStatus }) => {
//     const removed = await db.removeAsync(
//       { name, parentPath },
//       { multi: true }
//     );
//     setStatus('information', `Removed ${removed} records`);
//     return removed;
//   }
// );
