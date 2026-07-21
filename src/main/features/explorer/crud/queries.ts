import { MS_IN_AN_HOUR } from "@/shared/constants";
import { nowUTCMs } from "@/shared/utilities";
import {
  ExplorerFileRecord,
  ExplorerFileRecordProps
} from "@/shared/features/explorer";
import { LogApi } from "@/main/shared";
import { explorerFileRecords } from "../schema";
import { cleanEFRPath } from "../extractors";
import { removeExplorerFileRecords } from "./mutators";
import { mapRecords } from "./records";

const db = explorerFileRecords.db;

export const queryManyExplorerRecords = async (
  query: Partial<ExplorerFileRecordProps>,
  sort = {},
) => mapRecords(() => db.findAsync(query, {}).sort(sort));

// So we want a record with undefined usage,
// isDirectory = true, and action != 'skip'.
export const queryUnscannedDirectories = () => mapRecords(() => db.findAsync({
  usage: undefined,
  isDirectory: true,
  action: { $ne: 'skip' }
}));

export const queryChildRecords = (
  parentPath: string
) => mapRecords(() => db.findAsync({ parentPath }));

// export const queryChildRecords = (
//   parentPath: string
// ) => mapRecords(() => db.findAsync({ parentPath }));
// , usage: undefined, isDirectory: true, action: { $ne: 'skip' }

// TODO: This should be used for handling dupes.
export const queryExplorerRecords = async (
  recordParam: ExplorerFileRecord, { log }: LogApi
) => log(
  `Querying ${recordParam.path}`,
  async (logApi) => {
    const [
      record, ...duplicates
    ] = await mapRecords(() => db.findAsync(recordParam.query));

    if (!record) return;

    const duplicatesRemoved = duplicates.length > 0
      ? await removeExplorerFileRecords(record, logApi)
      : 0
      ;

    if (duplicatesRemoved) return;

    if (record.data.updated === nowUTCMs() - MS_IN_AN_HOUR) {
      const cleaningReport = await cleanEFRPath(record, logApi);
      if (cleaningReport.status === 'exists') return record;
      if (cleaningReport.status === 'locked') {
        logApi.setStatus(
          'information', `Skipping ${cleaningReport.updates} records`
        );
        return cleaningReport.record;
      }
      logApi.setStatus(
        'information', 'Deleted record due to file absence.'
      );
      return; // Should be nothing to return.
    }

    return record;
  }
);
