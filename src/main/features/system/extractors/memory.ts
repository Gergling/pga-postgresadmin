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
  return { totalMemory, freeMemory, memoryFreePercentage };
};

const data: {
  started: boolean;
  free: number[];
} = {
  started: false,
  free: [],
};

const tick = async () => {
  if (data.started) return;
  data.free = [
    ...data.free, extractSystemMemory().memoryFreePercentage
  ].slice(-MAXIMUM_TICKS);
  await wait(1000);
  tick();
};

export const getTrendingFreeMemory = () => median(data.free);
export const getSystemMemoryAvailabilityValues = () => data.free;
export const getSystemMemoryAvailabilityRange = () => mathsStatisticsSpread(
  data.free
);

tick();
