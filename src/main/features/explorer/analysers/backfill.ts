// TODO: We're scrapping backfill. Instead we'll be using a resource-adaptive
// system for handling operations.

import {
  ExplorerFileRecord,
  ExplorerFileRecordAction
} from "@/shared/features/explorer";
import { ROOT_RESOLVED_PATH } from "../constants";

type GeneralComparator<T> = (a: T, b: T) => number;
type Comparator = GeneralComparator<ExplorerFileRecord>;

const comparatorFactory = (
  direction: 'asc' | 'desc', ascComparator: Comparator
): Comparator => (a, b) => {
  if (direction === 'asc') return ascComparator(a, b);
  return ascComparator(b, a);
};

const comparatorStacker = (comparators: Comparator[]): Comparator => (a, b) => {
  for (const comparator of comparators) {
    const result = comparator(a, b);
    if (result !== 0) return result;
  }
  return 0;
};

const comparatorFactoryUndefinedPriority = <T>(
  getter: (record: T) => unknown
): GeneralComparator<T> => (a, b) => {
  if (getter(a) === undefined) return -1;
  if (getter(b) === undefined) return 1;
  return 0;
};


const compareDepth: Comparator = (a, b) => b.depth - a.depth;
const compareUpdated: Comparator = (a, b) => a.data.updated - b.data.updated;
const compareAge = comparatorFactory('asc', compareUpdated);
const compareRecency = comparatorFactory('desc', compareUpdated);
const compareUsage: Comparator = (a, b) => {
  if (a.data.usage === undefined) return -1;
  if (b.data.usage === undefined) return 1;
  return 0;
};
const compareDirectory: Comparator = (a, b) => {
  if (a.data.isDirectory) return -1;
  if (b.data.isDirectory) return 1;
  return 0;
};
const compareActionPrioritise = (
  action: ExplorerFileRecordAction
): Comparator => (a, b) => {
  if (a.data.action === action) return -1;
  if (b.data.action === action) return 1;
  return 0;
};
const compareAction: Comparator = comparatorStacker([
  compareActionPrioritise('traverse'),
  comparatorFactory('desc', compareActionPrioritise('skip')),
]);

const createConfig = <T extends Comparator[]>(config: T): T => config;

// We're backfilling, so recency will probably be taken care of else beforehand.
const comparators = createConfig([
  // Deepest and oldest
  comparatorStacker([
    compareDepth,
    compareUsage,
    compareDirectory,
    compareAction,
    compareAge
  ]),
  // Deepest and newest
  comparatorStacker([
    compareDepth,
    compareUsage,
    compareDirectory,
    compareAction,
    compareRecency
  ]),
  // Oldest first
  compareAge,
  // Newest first
  compareRecency,
]);

// 
// const getBackfillPrioritisedScannables = (
//   records: ExplorerFileRecord[]
// ) => records.filter().sort(comparatorStacker([
//   compareActionPrioritise('scan'),
//   comparatorFactory('desc', compareActionPrioritise('skip')),
// ]));

export const getBackfillEligiblePaths = (records: ExplorerFileRecord[]) => {
  const map = new Map(records.map((record) => [record.path, record]));

  // Add an arbitrary traversal to the list.
  const [firstTraversal] = records.filter(
    (r) => r.data.action === 'traverse'
      && r.data.usage === undefined
      && r.data.isDirectory
  );
  const traversals = [firstTraversal];

  // Pick the first item from each list that doesn't duplicate any items in
  // our new list.
  const eligible = comparators.reduce((eligible, comparator) => {
    const sortedRecords = [...records].sort(comparator);
    // We want to replace leaf records with their directory parents.
    const directoryRecords = sortedRecords.map((record) => {
      if (record.data.isDirectory) return record;
      const directoryRecord = map.get(record.data.parentPath);
      if (directoryRecord) return directoryRecord;
      // For whatever reason, this path isn't in the database, so we create
      // an instance.
      return new ExplorerFileRecord({
        absolutePath: record.data.parentPath,
        isDirectory: true,
      });
    });

    // The array of directory records will still be sorted based on the
    // criteria of leaf files, so will be prone to duplicates.
    // Fortunately, we are making a list of unique candidates anyway.
    // So we go from the top of the sorted list and pick the first one
    // that isn't already in the eligible list, then return the eligible list
    // so far.
    const item = directoryRecords.find(
      (record) => !eligible.get(record.path)
        && record.data.usage === undefined
        && record.path !== ROOT_RESOLVED_PATH
        && record.data.action !== 'skip'
    );
    if (item) return eligible.set(item.path, item);

    // And if we don't find an eligible item, we return the eligible map,
    // which could be empty.
    return eligible;
  }, new Map<ExplorerFileRecord['path'], ExplorerFileRecord>(
    traversals.map((t) => [t.path, t])
  ));

  // Finally, we get the paths and return them.
  const paths = [...eligible.values()].map((r) => r.path);

  return paths;
};


// Imported from other files for reference:

// export class ExplorerFileRecord {
//   data: ExplorerFileRecordProps;

//   constructor(data: ConstructorInputWithAbsolutePath);
//   constructor(data: ExplorerFileRecordProps);
//   constructor(data: ConstructorInputWithAbsolutePath | ExplorerFileRecordProps) {
//     if ('absolutePath' in data) {
//       const { absolutePath, ...rest } = data;
//       this.data = explorerFileRecordSchema.parse({
//         ...rest,
//         name: path.basename(absolutePath),
//         parentPath: path.dirname(absolutePath),
//       });
//       return this;
//     }
//     this.data = explorerFileRecordSchema.parse(data);
//   }

//   get depth(): number {
//     return this.data.parentPath.split(path.resolve('', '')).length;
//   }
//   get path(): string {
//     return path.resolve(this.data.parentPath, this.data.name);
//   }
//   get query(): ExplorerFileRecordQuery {
//     const { name, parentPath } = this.data;
//     return { name, parentPath };
//   }
// };

// export const ROOT_RESOLVED_PATH = resolveAbsolutePath('/');

// import z from "zod";
// import { nowUTCMs } from "@/shared/utilities";
// import { resolveAbsolutePath } from "./utilities";

// export const explorerParentPathSchema = z.string().transform(resolveAbsolutePath);

// export const explorerFileRecordQuerySchema = z.object({
//   name: z.string(),
//   parentPath: explorerParentPathSchema,
// });

// export type ExplorerFileRecordQuery = z.infer<typeof explorerFileRecordQuerySchema>;

// const explorerFileRecordAction = z.enum(['none', 'traverse', 'scan', 'skip']);

// export type ExplorerFileRecordAction = z.infer<typeof explorerFileRecordAction>;

// export const explorerFileRecordPayloadSchema = z.object({
//   action: explorerFileRecordAction.default('none'),
//   health: z.enum(['ok', 'duplicate', 'orphan', 'corrupt']).default('ok'),
//   isDirectory: z.boolean(),
//   updated: z.number().describe('UTC epoch milliseconds').default(nowUTCMs),
//   usage: z.number().optional(),
// });

// export type ExplorerFileRecordPayload = z.infer<
//   typeof explorerFileRecordPayloadSchema
// >;

// export const explorerFileRecordSchema = explorerFileRecordQuerySchema.extend(
//   explorerFileRecordPayloadSchema.shape
// );

// export type ExplorerFileRecordProps = z.infer<typeof explorerFileRecordSchema>;
