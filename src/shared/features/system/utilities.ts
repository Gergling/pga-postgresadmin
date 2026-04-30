import type { CpuInfo } from 'node:os';
import { SystemCpuUsageAction, SystemCpuUsageState } from "./types";

const CPU_USAGE_TOTAL_SNAPSHOTS = 60;

export const reduceUsage = (
  state: SystemCpuUsageState,
  snapshot: SystemCpuUsageAction
) => [...state, snapshot].slice(-CPU_USAGE_TOTAL_SNAPSHOTS);

export const summariseCpuUsage = (
  cpus: CpuInfo[]
) => cpus.reduce((acc, core) => {
  const total = Object.values(core.times).reduce(
    (total, value) => total + value, 0
  );
  return acc + (core.times.idle / total);
}, 0) / cpus.length;
