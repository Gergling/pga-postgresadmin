import os from 'node:os';
import { summariseCpuUsage } from "@/shared/features/system";
import { median } from '@/shared/utilities';

/**
 * This construct sits as a singleton keeping 20 seconds of CPU usage data in
 * memory.
 */
const data: {
  started: boolean;
  usage: number[];
} = {
  started: false,
  usage: [],
};

const getCpuUsageSnapshot = () => summariseCpuUsage(os.cpus());

/**
 * Takes a CPU usage snapshot every second.
 */
const tick = () => {
  // If it's already started, we don't want to start another one.
  if (data.started) return;
  data.started = true;

  // We add the current CPU usage to the end of the array, but only keep the 
  // last entries. This is to make sure we aren't leaking.
  data.usage = [...data.usage, getCpuUsageSnapshot()].slice(-60);

  // Wait a second and repeat.
  setTimeout(tick, 1000);
};

process.parentPort.on('message', () => {
  const cpuUsage = median(data.usage);
  process.parentPort.postMessage({ cpuUsage });
});

tick();
