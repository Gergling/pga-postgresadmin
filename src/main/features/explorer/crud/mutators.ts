import { LogApi } from "@/main/shared";
import { explorerFileRecords } from "../schema";
import { ExplorerFileRecord } from "@/shared/features/explorer";

const db = explorerFileRecords.db;

export const removeExplorerFileRecords = async (
  record: ExplorerFileRecord, { log }: LogApi
) => log(
  `Removing explorer file records for ${record.path}`,
  async ({ setStatus }) => {
    const removed = await db.removeAsync(
      record.query,
      { multi: true }
    );
    setStatus('information', `Removed ${removed} records`);
    return removed;
  }
);
