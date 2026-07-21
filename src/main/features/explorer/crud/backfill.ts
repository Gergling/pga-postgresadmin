import { ExplorerFileRecord } from "@/shared/features/explorer";
import { LogApi } from "@/main/shared";
import { explorerFileRecords } from "../schema";
import { ROOT_RESOLVED_PATH } from "../constants";
import { mapRecords } from "./records";
import { getBackfillEligiblePaths } from "../analysers";

const db = explorerFileRecords.db;

export const searchBackfillEligiblePaths = async ({ log, setStatus }: LogApi) => log(
  `Searching for eligible backfill paths`,
  async () => {
    // Read all the records and transform into objects.
    const records = await mapRecords(() => db.findAsync({}));
    const paths = getBackfillEligiblePaths(records);

    setStatus('information', paths);

    // We append the root path to the end of the array, JIC the database is
    // empty or traversal can't do anything with the other paths. This is a
    // simple way to handle starting the database, which means we can easily
    // 'clean up' and start again or start on a new machine if we have to.
    return [...paths, ROOT_RESOLVED_PATH];
  }
);
