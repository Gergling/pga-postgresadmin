import { wait } from "@shared/utilities/timeout";
import * as os from 'node:os';

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

const getCpuUsageSnapshot = () => {
  const cpus = os.cpus();
  return cpus.reduce((acc, core) => {
    const total = Object.values(core.times).reduce(
      (total, value) => total + value, 0
    );
    return acc + (core.times.idle / total);
  }, 0) / cpus.length;
};

/**
 * 
 * @returns 
 */
const tick = async () => {
  /**
   * If it's already started, we don't want to start another one.
   */
  if (data.started) return;
  /**
   * We add the current CPU usage to the end of the array, but only keep the
   * last entries. This is to make sure we aren't leaking.
   */
  data.usage = [...data.usage, getCpuUsageSnapshot()].slice(-60);
  /**
   * Wait a second...
   */
  await wait(1000);
  /**
   * Ok, let's do it again.
   */
  tick();
};

export const getCpuUsage = () => {
  const length = data.usage.length;
  const middle = length / 2;
  const sorted = data.usage.sort();
  const median = length % 2 === 0
    ? (sorted[middle] + sorted[middle - 1]) / 2
    : sorted[Math.floor(middle)]
  ;
  return median;
};

tick();
