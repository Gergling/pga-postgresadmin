import * as os from 'node:os';
import { CheckResourceResponse, getSystemBands, SystemCheckResponse } from '@/shared/features/system';
import {
  getCpuFreeMean,
  getCpuUsage,
  getSystemCpuAvailabilityRange,
  getSystemCpuAvailabilityValues,
  getSystemMemoryAvailabilityRange,
  getSystemMemoryAvailabilityValues,
  getTrendingFreeMemory
} from './extractors';

export const checkResources = async (): Promise<CheckResourceResponse> => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryFreePercentage = (freeMemory / totalMemory);

  const cpuAvailable = getCpuUsage();

  return { cpuAvailable, memoryFreePercentage };
};

export const systemCheck = (): SystemCheckResponse => {
  const memory = {
    // median: getTrendingFreeMemory(), // TODO
    mean: getTrendingFreeMemory(),
    values: getSystemMemoryAvailabilityValues(),
    range: getSystemMemoryAvailabilityRange(),
  };
  const cpu = {
    // median: getCpuUsage(), // TODO
    mean: getCpuFreeMean(),
    values: getSystemCpuAvailabilityValues(),
    range: getSystemCpuAvailabilityRange()
  };
  const bands = getSystemBands(cpu.mean, memory.mean);
  const compute = {
    mean: bands.compute,
    band: bands.compute,
  };
  return {
    cpu,
    memory,
    compute
  };
};
