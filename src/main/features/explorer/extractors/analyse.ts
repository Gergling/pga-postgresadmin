// TODO: Analyse: "analyse" -> scan, ascend, descend, none

import {
  ExplorerFileRecord,
  ExplorerFileRecordAction
} from "@/shared/features/explorer";
import { getPathData, LogApi } from "@/main/shared";
import { reviewExplorerPath } from "./review";
import { extractFileMetadata } from "./data";
import { queryManyExplorerRecords, upsertExplorerFileRecords } from "../crud";
import { extractExplorerPriority } from "./system";

// This should be a review.
// Extract the file access status. This probably happens during review as
// well, but review is a sweep that targets none, skip and defer.
// That means we also need to handle age in those cases.
// Older 

// If NOT existent, we can remove the record and quit.
// If NOT readable AND undefined usage AND defer, we skip and quit.
// If NOT readable AND undefined usage AND NOT skip, we defer and quit.
// If NOT readable AND defined usage, we defer and quit.

const readAction = async (record: ExplorerFileRecord): Promise<ExplorerFileRecordAction> => {
  // If NOT usage AND leaf, scan.
  // If NOT usage AND directory, descend.
  // If no usage has been recorded for the path, we can assume we want it.
  if (record.data.usage === undefined) {
    // If it's a directory, we should check the children.
    if (record.data.isDirectory) return 'descend';

    // Otherwise we can just scan it.
    return 'scan';
  }

  const [[parent], children] = await Promise.all([
    queryManyExplorerRecords(getPathData(record.data.parentPath)) as Promise<(ExplorerFileRecord | undefined)[]>,
    queryManyExplorerRecords({ parentPath: record.path }),
  ]);
  const child = children.reduce((oldest, child) => {
    if (!oldest) return child;
    return child.data.updated < oldest.data.updated ? child : oldest;
  }) as ExplorerFileRecord | undefined;

  const [{ key }] = Object.entries({ parent, record, child }).map(
    ([key, value]) => ({ key, value })
  ).sort(({ value: a }, { value: b }) => {
    if (a === undefined) return 1;
    if (b === undefined) return -1;
    return a.data.updated - b.data.updated
  });

  if (key === 'child') return 'descend';
  if (key === 'parent') return 'ascend';

  return 'scan';
};

// We decide how this item should be handled next.
export const processAnalysis = (
  record: ExplorerFileRecord, { log }: LogApi
) => log(`Analysing ${record.path}`, async (logApi) => {
  const readable = await reviewExplorerPath(record, logApi);
  if (!readable) return;

  const action = await readAction(record);

  const updates = await upsertExplorerFileRecords(
    record.query, { action }, logApi
  );

  return updates;
});

export const processAnalysisSweep = ({ log }: LogApi) => log(
  `Analysis Sweep`, async (logApi) => {
    // TODO: Get everything with the status of "analyse".
    const records = await queryManyExplorerRecords(
      { action: 'analyse' }, { updated: -1 }
    );
    const sorted = records.sort((a, b) => {
      const updatedComparison = a.data.updated - b.data.updated;
      if (updatedComparison !== 0) return updatedComparison;
      if (a.data.usage === undefined) return -1;
      if (b.data.usage === undefined) return 1;
      return 0;
    });

    for (const record of sorted) {
      const updates = await processAnalysis(record, logApi);
      const priority = extractExplorerPriority(5);
      // Ideally we need a function where we can put in the minimum free
      // resources (e.g. amber means amber through to green is valid).
      return;
    }
  }
);