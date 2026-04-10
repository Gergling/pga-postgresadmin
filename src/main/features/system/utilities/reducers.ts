import { SystemCpuUsageAction, SystemCpuUsageState } from "../types";

const CPU_USAGE_TOTAL_SNAPSHOTS = 60;
export const reduceUsage = (
  state: SystemCpuUsageState,
  snapshot: SystemCpuUsageAction
) => [...state, snapshot].slice(-CPU_USAGE_TOTAL_SNAPSHOTS);
