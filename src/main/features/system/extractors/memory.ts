import {
  mathsStatisticsSpread,
  median,
  wait
} from '@/shared/utilities';
import * as os from 'node:os';

const MAXIMUM_TICKS = 60;

export const extractSystemMemory = () => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryFreePercentage = (freeMemory / totalMemory);
  const memoryUsageFraction = 1 - memoryFreePercentage;
  return { totalMemory, freeMemory, memoryFreePercentage, memoryUsageFraction };
};

const data: {
  free: number[];
  started: boolean;
  usage: number[];
} = {
  free: [],
  started: false,
  usage: [],
};

const tick = async () => {
  if (data.started) return;
  const { memoryFreePercentage, memoryUsageFraction } = extractSystemMemory();
  data.free = [
    ...data.free, memoryFreePercentage
  ].slice(-MAXIMUM_TICKS);
  data.usage = [
    ...data.usage, memoryUsageFraction
  ].slice(-MAXIMUM_TICKS);
  await wait(1000);
  tick();
};

export const getTrendingFreeMemory = () => median(data.free);
export const getTrendingMemoryUsage = () => median(data.usage);
export const getSystemMemoryAvailabilityValues = () => data.free;
export const getSystemMemoryAvailabilityRange = () => mathsStatisticsSpread(
  data.free
);

tick();
