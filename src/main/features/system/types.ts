export type SystemCpuUsageState = number[];
export type SystemCpuUsageAction = number;

export type CheckResourceResponse = {
  cpuAvailable: number;
  memoryFreePercentage: number;
};
