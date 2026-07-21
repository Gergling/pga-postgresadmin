import { ExplorerFileRecord } from "@/shared/features/explorer";
import { queryChildRecords, queryExplorerRecords, queryManyExplorerRecords, queryUnscannedDirectories, searchBackfillEligiblePaths } from "../crud";
import { traverse } from "../loaders";
import { LogApi } from "@/main/shared";

// Find a directory with no children.
// So we want a record with undefined usage, isDirectory = true, and action != 'skip'.
// Then we look for that absolute path in a parentPath.
// If we find no children, we spit out this record.
// If we do find children, we recurse.
// We can do this for every eligible record. This will double the candidates.

// Until I come up with a better name, "Planet X".
const searchForPlanetX = (
  absolutePath: string, { log }: LogApi
) => log(`Searching for directory with no children`, async (logApi) => {
  const unscannedDirectories = await queryUnscannedDirectories();
});

const searchChildRecords = async (parentPath: string, { log }: LogApi) => log(
  `Searching for children of ${parentPath}`,
  async (logApi) => {
    const childRecords = await queryChildRecords(parentPath);

  }
);

export const explorerBackfill = ({ log }: LogApi) => log(
  `Backfilling explorer file records`,
  async (logApi) => {
    const paths = await searchBackfillEligiblePaths(logApi);

    for (const path of paths) {
      await traverse(path, logApi);
      // TODO: Evaluate time spent on task.
      // If it was more than a second, then evaluate resources. If yellow or
      // red, we can stop here. Backfill should always happen, but should be low
      // priority.
    }

    // type ExplorerFileRecordProps = {
    //     name: string;
    //     parentPath: string;
    //     action: "none" | "traverse" | "scan" | "skip";
    //     health: "ok" | "duplicate" | "orphan" | "corrupt";
    //     isDirectory: boolean;
    //     updated: number;
    //     usage?: number | undefined;
    // }

    // TODO: Scan anything and everything.
    // First sort is by action === 'scan'.
    // Then sort by undefined usage at the top.
    // Then sort by 
    // If it results in a piece of information that wasn't there before,
    // we can take a break.
    // We can evaluate resources (later) and take a break.
    // Otherwise, we keep going.
    // Should probably sort paths in some useful way.
    // E.g. undefined usage at the top, otherwise it's just an update.
  }, { showSummaryChildren: false }
);
