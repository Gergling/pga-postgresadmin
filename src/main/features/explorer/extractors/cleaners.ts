// TODO: No more cleaning the whole log in one go. We will be cleaning as we
// perform sweep operations.
import { ExplorerFileRecord } from "@/shared/features/explorer";
import { fileExists, LogApi } from "@/main/shared";
import { readAllExplorerRecords, removeExplorerFileRecords, upsertExplorerFileRecords } from "../crud";
import { extractFileMetadata, extractFileStatus } from "./data";

export const cleanEFRPath = async (
  record: ExplorerFileRecord, { log }: LogApi
) => log(
  `Cleaning Explorer File Record for ${record.path}`,
  async (logApi) => {
    const { data: { parentPath, name } } = record;
    const status = await extractFileStatus(record.path);
    switch (status) {
      case 'absent':
        // Delete the record.
        const removed = await logApi.log(
          `Identified as orphan. Removing.`,
          (props) => removeExplorerFileRecords(record, props)
        );
        return { status, updates: removed };
      case 'locked':
        // Updated for skipping.
        const updated = new ExplorerFileRecord({ ...record.data, action: 'skip' });
        const upserts = await upsertExplorerFileRecords(
          record.query, { action: updated.data.action }, logApi
        );
        return { status, updates: upserts, record: updated };
      default: return { status };
    }
  }
);

export const cleanExplorerOrphanRecords = async (
  { log }: LogApi
) => {
  // Handle orphans.
  await log('Handling orphans', async ({ log, setStatus }) => {
    // Check whether the path exists.
    const records = await log('Reading all records', readAllExplorerRecords);
    const updates = {
      removed: 0,
      inserted: 0,
    };
    await log(
      'Checking existence',
      (logApi) => Promise.all(records.map(async (data) => {
        const record = new ExplorerFileRecord(data);
        // const { data: { parentPath, name }, path } = record;
        const cleanReport = await cleanEFRPath(record, logApi);
        // const status = await extractFileStatus(path);
        // const exists = await fileExists(path);
        // console.log('ORPHAN CHECK', parentPath, name, path, exists);
        if (cleanReport.status === 'exists') {
          const meta = await extractFileMetadata(record.path);
          // TODO: Check the rest of the lineage exists as records.
          // Can be set to directory.
          // If the record doesn't exist, upsert with action: traverse.
          // upsertExplorerFileRecords
        }
      }))
    );

    const noUpdates = updates.removed + updates.inserted === 0;
    const message = [
      updates.removed > 0 && `Removed ${updates.removed} orphan records.`,
      updates.inserted > 0 && `Inserted ${updates.inserted} records.`,
      noUpdates && 'No updates needed.',
    ].filter(Boolean).map((m) => `${m}`);
    setStatus(noUpdates ? 'information' : 'warning', message);

    // If so, check whether the path should have a parent.
    // If so, make sure the lineage exists.
    // Otherwise, delete the record.
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
