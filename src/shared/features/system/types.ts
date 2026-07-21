import { MathsStatisticsSpread } from "@/shared/types";
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
