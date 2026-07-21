// TODO: Ascend: "ascend" -> none. If parent record is absent or set to
// "none, defer, skip", parent record will be set to "analyse".

import {
  ExplorerFileRecord,
  ExplorerFileRecordAction
} from "@/shared/features/explorer";
import { getPathData, LogApi } from "@/main/shared";
import { reviewExplorerPath } from "./review";
import { queryManyExplorerRecords, upsertExplorerFileRecords } from "../crud";
import { extractExplorerPriority } from "./system";

// const readAction = async (
//   record: ExplorerFileRecord
// ): Promise<ExplorerFileRecordAction> => {
//   // Check parent record.
//   const [parent] = await (queryManyExplorerRecords(getPathData(record.data.parentPath)) as Promise<(ExplorerFileRecord | undefined)[]>);
//   if (parent === undefined
//     || ['none', 'defer', 'skip'].includes(parent.data.action)
//   ) return 'analyse';
// };

const readParent = async (
  record: ExplorerFileRecord,
  { log }: LogApi
) => log(
  `Reading parent for ${record.path}`,
  async () => {
    const action: ExplorerFileRecordAction = 'analyse';
    const pathData = getPathData(record.data.parentPath);
    const [parent] = await (
      queryManyExplorerRecords(pathData) as Promise<(ExplorerFileRecord | undefined)[]>
    );
    if (parent) {
      if (['none', 'defer', 'skip'].includes(
        parent.data.action
      )) return new ExplorerFileRecord({ ...parent.data, action });
      return parent;
    }
    return new ExplorerFileRecord({
      ...pathData, isDirectory: true, action,
    });
  }
);

// We decide how this item should be handled next.
export const processAscension = (
  record: ExplorerFileRecord, { log }: LogApi
) => log(`Ascending ${record.path}`, async (logApi) => {
  const readable = await reviewExplorerPath(record, logApi);
  if (!readable) return;

  const parent = await readParent(record, logApi);

  await upsertExplorerFileRecords(
    parent.query, { action: parent.data.action }, logApi
  );
});

export const processAscendSweep = ({ log }: LogApi) => log(
  `Ascension Sweep`, async (logApi) => {
    const records = await queryManyExplorerRecords(
      { action: 'ascend' }, { updated: -1 }
    );
    const sorted = records.sort((a, b) => {
      const updatedComparison = a.data.updated - b.data.updated;
      if (updatedComparison !== 0) return updatedComparison;
      if (a.data.usage === undefined) return -1;
      if (b.data.usage === undefined) return 1;
      return 0;
    });

    for (const record of sorted) {
      const updates = await processAscension(record, logApi);
      const priority = extractExplorerPriority(5);
      // Ideally we need a function where we can put in the minimum free
      // resources (e.g. amber means amber through to green is valid).
      return;
    }
  }
);