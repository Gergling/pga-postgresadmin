import {
  DirentSummary,
  ExplorerFileRecord,
  ExplorerFileRecordProps,
} from "@/shared/features/explorer";
import { listContents } from "../extractors";
import {
  queryExplorerRecords,
  readPathRecords,
  upsertExplorerFileRecords
} from "../crud";
import { LogApi } from "@/main/shared";

const mergeExistingRecords = (
  files: DirentSummary[], { log }: LogApi
) => log(
  'Merging existing records', ({ log }) => Promise.all(files.map(
    ({ absolutePath, meta: { isDirectory } }) => log(
      absolutePath,
      async (logApi) => {
        const { setStatus } = logApi;
        const record = new ExplorerFileRecord({ absolutePath, isDirectory });

        const existing = await queryExplorerRecords(record, logApi);

        if (!existing) {
          setStatus('information', '')
          return record;
        }

        return record.merge(existing.data);
      }
    )
  )), { showSummaryChildren: false }
);

const checkExistingRecords = async (
  files: DirentSummary[], { log }: LogApi
) => log(
  'Checking existing records for children',
  async ({ log }) => {
    const inserts: ExplorerFileRecordProps[] = [];
    const updatedDirectories: string[] = [];
    const updatedFiles: string[] = [];
    await Promise.all(files.map(
      ({ absolutePath, meta: { isDirectory } }) => log(
        absolutePath,
        async (props) => {
          const { setMessage, setStatus } = props;
          const record = new ExplorerFileRecord({ absolutePath, isDirectory });

          const existing = await readPathRecords(
            record.data.name, record.data.parentPath, props
          );

          // setStatus('information');

          if (!existing) {
            setMessage('Inserting');
            return inserts.push(record.data);
          }

          // console.log('existing?', existing)
          if (existing.action === 'skip') {
            // console.log('THIS SHOULD HAVE BEEN SKIPPED')
            setStatus('information', 'Skipping');
            return
          };

          if (existing.isDirectory) {
            setMessage('Updating directory');
            return updatedDirectories.push(record.data.name);
          }

          setMessage('Updating file');
          return updatedFiles.push(record.data.name);
        }
      )
    ));
    return {
      inserts, updates: { directories: updatedDirectories, files: updatedFiles }
    };
  }
);

export const traverse = async (
  parentPath: string, { log }: LogApi
) => log(
  `Traversing ${parentPath}`,
  async (logApi) => {
    const { log, setStatus } = logApi;
    const parentRecord = new ExplorerFileRecord({
      absolutePath: parentPath, isDirectory: true
    });

    const files = await listContents(parentPath, logApi);

    if (files.length === 0) {
      // We can basically return early, because there is nothing to see.
      // In addition, we can set the folder usage to 0, because it has no files.
      await upsertExplorerFileRecords(
        parentRecord.query, { action: 'none', usage: 0 }, logApi
      );
      setStatus('information', 'Folder has no files. Set usage to 0.');
      return { inserts: [], updates: { directories: [], files: [] } };
    }

    const records = await mergeExistingRecords(files, logApi);

    const shouldScanParent = records.every(
      ({ data: { usage } }) => usage !== undefined
    );
    const results = await log(
      'Loading', ({ log }) => Promise.all(records.map((item) => {
        const action = item.data.isDirectory ? 'traverse' : 'scan';
        return log(item.path, (logApi) => upsertExplorerFileRecords(
          item.query, { ...item, action }, logApi
        ));
      }))
    );

    const parentRecordResult = shouldScanParent ? await log(
      `Updating parent for scanning`,
      (logApi) => upsertExplorerFileRecords(
        parentRecord.query, { action: 'scan' }, logApi
      )
    ) : undefined;

    // const { inserts, updates } = await checkExistingRecords(files, logApi);

    // const [, updateResult, updateFileResult] = await log(
    //   'Loading',
    //   ({ log }) => Promise.all([
    //     log(
    //       `Inserting ${inserts.length} records`,
    //       (logApi) => Promise.all(inserts.map(
    //         (item) => upsertExplorerFileRecords(item, item, logApi)
    //       ))
    //     ),
    //     log(
    //       `Updating ${updates.directories.length} directory records for traversal`,
    //       (logApi) => {
    //         const queries = updates.directories.map(
    //           (name) => ({ name, parentPath })
    //         );
    //         return upsertExplorerFileRecords(
    //           queries,
    //           {
    //             isDirectory: true,
    //             action: 'traverse',
    //             health: 'ok',
    //           },
    //           logApi
    //         );
    //       }
    //     ),
    //     log(
    //       `Updating ${updates.files.length} file records for scanning`,
    //       (logApi) => {
    //         const queries = updates.files.map(
    //           (name) => ({ name, parentPath })
    //         );
    //         return upsertExplorerFileRecords(
    //           queries,
    //           {
    //             isDirectory: false,
    //             action: 'scan',
    //             health: 'ok',
    //           },
    //           logApi
    //         );
    //       }
    //     )
    //   ])
    // );

    // const 

    // const message = [
    //   `Updated ${updateResult ? updateResult : 'no'} directory records for traversal.`,
    //   `Updated ${updateFileResult ? updateFileResult : 'no'} file records for scanning.`
    // ];
    // setStatus('information', message);

    return {
      // inserts, updates
    };
  }
);
