import { explorerBackfill } from "./backfill";
import { readExplorerStatus, updateExplorerStatus } from "../crud/options";
import {
  readActivity,
} from '../crud';
import { loadSpaceUsed, traverse } from '../loaders';
import { log, LogApi } from '@/main/shared';
import { extractDiskDriveCapacity } from "./drive";
import { transformProgress } from "../transformers";
import { extractStatusSnapshot } from "./status";
import { processAnalysisSweep } from "./analyse";

type CheckParams = {
  backfill: boolean;
  limit: number;
  logApi: LogApi;
  timeout: number;
};

export const explorerCheck = async ({
  backfill, limit, logApi: { log, setMessage, setStatus }, timeout
}: CheckParams) => {
  const driveCapacityPromise = log(
    'Extracting overall disk drive usage and capacity',
    () => extractDiskDriveCapacity(),
  );

  const startingAggregationStatus = await log(
    'Reading status snapshot',
    async (logApi: LogApi) => {
      const snapshot = await extractStatusSnapshot(logApi);
      logApi.setStatus(
        'information',
        `Found ${snapshot.scanned}/${snapshot.total} (${snapshot.formatted}) records.`
      );
      return snapshot;
    }
  );

  // Check if the process is already running.
  const status = await log(
    'Checking explorer status', readExplorerStatus
  );
  if (status !== 'ready') {
    setStatus('warning', `Explorer is not ready, ${status} instead.`);
    return;
  }

  // extractExplorerPriority();

  // All processes can generate defer and skip, as they will all need to run
  // status checks against files for readability.

  // Anything that looks for actions in the database should be considered the
  // "sweep". Sweeps are subject to path-analysis-level resource checks.

  // TODO: Analyse: "analyse" -> scan, ascend, descend, none
  // TODO: Scan: "scan" -> none, ascend.
  // TODO: Ascend: "ascend" -> none. If parent record is absent or set to
  // "none, defer, skip", parent record will be set to "analyse".
  // TODO: Descend: "descend" -> none, analyse. If child records are absent or
  // set to "none, defer", child records will be set to "analyse".
  // TODO: Review: "none, defer, skip" -> none, analyse. This checks for age.
  await log('Sweeping database', (logApi) => Promise.all([
    processAnalysisSweep(logApi),
    // TODO: Rework ascend (amber)
    // TODO: Rework descend (amber)
    // TODO: Rework review (probably yellow priority)
    // TODO: Rework scan (amber)
  ]));
  await Promise.all([
    log("Scan", async (props) => await loadSpaceUsed(limit, props)),
    log('Extractions', async (logApi) => {
      const { log, setStatus } = logApi;
      const activity = await log(
        `Checking for activity within ${timeout}ms`, () => readActivity(timeout)
      );
      if (activity.length > 0) {
        const { parentPath } = activity[0].data;
        await traverse(parentPath, logApi);
      } else {
        setStatus('information', 'No activity records found.');
      }

      if (backfill) {
        await explorerBackfill(logApi);
      }
    }),
  ]);

  await log(
    'Setting explorer status to reflect completion',
    () => updateExplorerStatus('ready')
  );

  await log(
    `Finishing aggregation status`,
    async (logApi) => {
      const [
        driveCapacity,
        finalStatusSnapshot
      ] = await Promise.all([
        driveCapacityPromise,
        extractStatusSnapshot(logApi),
      ]);

      const { formatted } = transformProgress(
        startingAggregationStatus,
        finalStatusSnapshot,
        driveCapacity,
      );

      logApi.setStatus(
        'information',
        formatted,
      );
    }
  );

};

// * Startup: Run Extraction (limit: 10, timeout: 5 minutes, backfill: true).
// * Minutely: Run Extraction (limit: 10, timeout: 5 minutes).
// * Hourly: Run Extraction (limit: 100, timeout: 1 day, backfill: true).

const ONE_MINUTE_IN_MS = 1000 * 60;
const FIVE_MINUTES_IN_MS = 5 * ONE_MINUTE_IN_MS;
const ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS;
const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;

const minutely = async () => {
  await log('Initiating minutely explorer check', (logApi) => explorerCheck({
    limit: 10, timeout: FIVE_MINUTES_IN_MS, backfill: false, logApi
  }));
  setTimeout(minutely, ONE_MINUTE_IN_MS);
};

const hourly = async () => {
  await log('Initiating hourly explorer check', (logApi) => explorerCheck({
    limit: 100, timeout: ONE_DAY_IN_MS, backfill: true, logApi
  }));
  setTimeout(hourly, ONE_DAY_IN_MS);
};

export const explorerStartup = async ({ log }: LogApi) => {
  // await log('Explorer health check', cleanEFR);
  // await log('Cleaning orphan records', cleanExplorerOrphanRecords);
  await log('Initiating startup explorer check', (logApi) => explorerCheck({
    backfill: true, limit: 10, timeout: FIVE_MINUTES_IN_MS, logApi
  }));
};

log('Initialise Explorer', explorerStartup, { showSummaryChildren: true });
