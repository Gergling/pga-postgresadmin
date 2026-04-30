export type SystemCpuUsageState = number[];
export type SystemCpuUsageAction = number;

export type CheckResourceResponse = {
  cpuAvailable: number;
  memoryFreePercentage: number;
};

export type SystemMetricsRequest = { type: 'cpu' };
export type SystemMetricsResponse = { medianFreeMem: number };
