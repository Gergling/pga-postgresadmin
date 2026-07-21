import {
  ExplorerFileRecord,
  ExplorerFileRecordAction
} from "@/shared/features/explorer";
import { LogApi } from "@/main/shared";
import { removeExplorerFileRecords, upsertExplorerFileRecords } from "../crud";
import { extractFileStatus } from "./data";

export const reviewExplorerPath = (
  record: ExplorerFileRecord, { log }: LogApi,
): Promise<boolean> => log(`Handling ${record.path}`, async (logApi) => {
  const status = await extractFileStatus(record.path);

  if (status === 'exists') return true;

  // If NOT existent, we can remove the record and quit.
  if (status === 'absent') {
    // Remove the record.
    await logApi.log(
      `Identified as orphan. Removing.`,
      (props) => removeExplorerFileRecords(record, props)
    );
    return false;
  }

  const action: ExplorerFileRecordAction = record.data.action !== 'skip'
    || record.data.usage !== undefined ? 'defer' : 'skip';
  const updated = new ExplorerFileRecord({ ...record.data, action });

  await upsertExplorerFileRecords(
    record.query, { action: updated.data.action }, logApi
  );

  return false;
});
//   const removed = await logApi.log(
//     `Identified as orphan. Removing.`,
//     (props) => removeExplorerFileRecords(record, props)
//   );
//   return { status, updates: removed };
// case 'locked':
//   // Updated for skipping.
//   const updated = new ExplorerFileRecord({ ...record.data, action: 'skip' });
//   const upserts = await upsertExplorerFileRecords(
//     record.query, { action: updated.data.action }, logApi
//   );

export const reviewExplorerSweep = () => {
  // Check for old none, defer and skip records.
  // Order should be defer, none and skip.
};
