import {
  ExplorerFileRecord,
  ExplorerFileRecordProps
} from "@/shared/features/explorer";
import {
  readChildExplorerRecords,
  readScannable,
  upsertExplorerFileRecords,
} from "../crud";
import { extractFileMetadata, extractFileStatus } from "../extractors";
import { LogApi } from "@/main/shared";
import { parseError } from "@/shared/schema/error";

// TODO: We need to be sure that this function will actually update the directories.
// A node with a complete set of leaves (a folder with no directories) will
// update its usage.
// Will a node with folders ever get an aggregated usage?
// If it does, will the usage be up to date? I guess that's handled separately.

/**
 * Aggregates the space used by the child records of a directory.
 * @param directoryRecord The directory record to aggregate.
 * @returns The directory record that was updated.
 */
const aggregate = async (
  directoryRecord: ExplorerFileRecordProps,
  logApi: LogApi
) => {
  //   2. Aggregate: Find first record of `isDirectory: true` with the action `scan`. If none are returned, we're done.
  // const { log } = logApi;
  const directory = new ExplorerFileRecord(directoryRecord);
  // Fetch all the records for children of the directory.
  const children = await readChildExplorerRecords(directory.path);

  // Check for any sub-directories we intend to scan.
  const nextDirectory = children.find(
    ({ data: { action, isDirectory } }) => isDirectory && action === 'scan'
  );

  // If there is a sub-directory, we recurse.
  if (nextDirectory) {
    return aggregate(nextDirectory.data, logApi);
  }

  // Otherwise, we sum the space used and apply it to the directory path.
  const usage = children.reduce((sum, { data: { usage = 0 } }) => sum + usage, 0);

  // We can set this directory's action to 'none' because we're done with it.
  return upsertExplorerFileRecords(directoryRecord, {
    action: 'none',
    usage
  }, logApi);
};

const extractMetadata = async (path: string, { log }: LogApi) => {
  try {
    const { size: usage } = await log(
      'Extracting metadata', () => extractFileMetadata(path)
    );
    return usage;
  } catch (error) {
    return parseError(error);
  }
};

/**
 * This function updates the `usage` property of a file system record.
 * @param limit For more frequent updates, limits the number of operations.
 * @returns The directory record that was updated.
 */
export const loadSpaceUsed = (
  limit: number, { log }: LogApi
) => log(`Load space used [limit: ${limit}]`, async (logApi) => {
  const { log, setStatus } = logApi;
  // Get the first non-directory files marked to be scanned.
  const files = await log(
    `Fetching first ${limit} scannable file records`,
    () => readScannable(limit, false)
  );

  setStatus('information', `Found ${files.length} scannable files`);

  // Loop the files, find the sizes and update the records.
  // TODO: It would be an optimisation to update the records in bulk, but TBH
  // it's local and up to 100 at a time, so probably not worth the extra effort.
  if (files.length) {
    await log(
      `Scanning ${files.length} files`,
      ({ log }) => Promise.all(files.map((file) => log(
        `Scanning ${file.data.name}`,
        async (logApi) => {
          const { data, path } = file;
          const status = await extractFileStatus(path);
          if (status !== 'locked') {
            const usage = await extractMetadata(path, logApi);
            if (typeof usage === 'number') {
              await logApi.log(
                'Loading metadata',
                (props) => upsertExplorerFileRecords(data, {
                  action: 'none', usage
                }, props)
              );
              return true;
            }
          }
          await logApi.log(
            'Skipping file',
            (props) => upsertExplorerFileRecords(data, {
              action: 'skip',
            }, props)
          );

          return false;
        }
      )))
    );
  }

  // Next, aggregate the next directory that is marked for a scan.
  // TODO: This handles precisely ONE directory to avoid overloading the system
  // resources.
  const [directory] = await log(
    `Fetching a scannable directory`,
    () => readScannable(limit, true),
  );
  if (!directory) {
    setStatus('information', `No scannable directories found.`);
    return;
  };
  setStatus('information', `Found scannable directory ${directory.path}`);

  return aggregate(directory.data, logApi);
});

// * Scan (limit):
//   1. Find [limit] records of `isDirectory: false` with the action `scan`. If none are returned, skip.
//     1. Extract the space used from the file path's stats.
//     2. Update the record with the space used and set action to 'none'.
//   2. Aggregate: Find first record of `isDirectory: true` with the action `scan`. If none are returned, we're done.
//     1. Check records for `parentPath` matching this record's `path`:
//       * If found: check for `isDirectory: true`:
//         * If found: Run aggregate for this record's `path`.
//         * Otherwise: Sum the space used and apply to this record's directory path.
//       * Otherwise: `usage: 0`.
//     2. Set `action` to `none`.

