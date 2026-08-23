import { MathsStatisticsSpread } from "@/shared/utilities";
import { SystemComputeColor } from "./config";

export type SystemCpuUsageState = number[];
export type SystemCpuUsageAction = number;

export type CheckResourceResponse = {
  cpuAvailable: number;
  memoryFreePercentage: number;
};

export type SystemMetricsRequest = { type: 'cpu' };
export type SystemMetricsResponse = { medianFreeMem: number };

export type SystemCheckResponse = {
  // isUserActive: boolean;
  memory: {
    // median: number;
    mean: number;
    values: number[];
    range: MathsStatisticsSpread;
  };
  cpu: {
    // median: number;
    mean: number;
    values: number[];
    range: MathsStatisticsSpread;
  };
  compute: {
    band: SystemComputeColor;
    /**
     * @deprecated Calculate in the renderer.
     */
    mean: SystemComputeColor;
    // values: SystemComputeColor[];
    // range: SystemComputeColor[];
  };
};

export type CpuSnapshot = { idle: number; total: number; };
export type DeltaSnapshot = CpuSnapshot & { free: number; usage: number; };
export type ReduceCpuUsageState = {
  lastSnapshot?: CpuSnapshot;
  delta: DeltaSnapshot[];
};
