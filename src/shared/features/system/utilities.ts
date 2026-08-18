import type { CpuInfo } from 'node:os';
import {
  CpuSnapshot,
  DeltaSnapshot,
  ReduceCpuUsageState,
  SystemCpuUsageAction,
  SystemCpuUsageState
} from "./types";

const CPU_USAGE_TOTAL_SNAPSHOTS = 60;

export const reduceUsage = (
  state: SystemCpuUsageState,
  snapshot: SystemCpuUsageAction
) => [...state, snapshot].slice(-CPU_USAGE_TOTAL_SNAPSHOTS);

export const summariseCpuUsage = (
  cpus: CpuInfo[]
) => 1 - (cpus.reduce((acc, core) => {
  const total = Object.values(core.times).reduce(
    (total, value) => total + value, 0
  );
  return acc + (core.times.idle / total);
}, 0) / cpus.length);

export const getCpuSnapshot = (
  cpus: CpuInfo[]
): CpuSnapshot => cpus.reduce((acc, core) => {
  const total = Object.values(core.times).reduce(
    (total, value) => total + value, 0
  );
  return { idle: acc.idle + core.times.idle, total: acc.total + total };
}, { idle: 0, total: 0 });

// TODO: It would actually be easier to keep number arrays for free and usage.
export const reduceCpuUsage = (
  acc: ReduceCpuUsageState, info: CpuInfo[]
): ReduceCpuUsageState => {
  const snapshot = getCpuSnapshot(info);
  if (!acc.lastSnapshot) return { lastSnapshot: snapshot, delta: [] };
  const free = (snapshot.idle - acc.lastSnapshot.idle) / (snapshot.total - acc.lastSnapshot.total);
  const newDelta: DeltaSnapshot = {
    free,
    idle: snapshot.idle - acc.lastSnapshot.idle,
    total: snapshot.total - acc.lastSnapshot.total,
    usage: 1 - free,
  };

  const delta = [...acc.delta, newDelta].slice(-CPU_USAGE_TOTAL_SNAPSHOTS);

  return { delta, lastSnapshot: snapshot };
};
