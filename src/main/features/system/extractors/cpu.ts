import * as os from 'node:os';
import { mathsStatisticsSpread, mean, median, wait } from "@/shared/utilities";
import { summariseCpuUsage } from "../utilities";

/**
 * This construct sits as a singleton keeping a history of CPU usage data in
 * memory.
 */
const data: {
  started: boolean;
  usage: number[];
} = {
  started: false,
  usage: [],
};

const MAXIMUM_TICKS = 60;

const getCpuUsageSnapshot = () => summariseCpuUsage(os.cpus());

/**
 * Takes a CPU usage snapshot every second.
 * @todo Move into a child thread JIC. It needs to run consistently on its own,
 * and the other operations are just for fetching the data.
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
  data.usage = [...data.usage, getCpuUsageSnapshot()].slice(-MAXIMUM_TICKS);
  /**
   * Wait a second...
   */
  await wait(1000);
  /**
   * Ok, let's do it again.
   */
  tick();
};

/**
 * 
 * @returns The median CPU usage in the last minute.
 */
export const getCpuUsage = () => {
  return median(data.usage);
};

export const getCpuFreeMean = (
  from: number = 0, to: number = data.usage.length
) => {
  const start = Math.max(Math.floor(from), 0);
  const end = Math.min(Math.max(Math.floor(to), start), data.usage.length);
  const free = data.usage.slice(start, end);
  return mean(free);
};

export const getSystemCpuAvailabilityValues = () => data.usage;
export const getSystemCpuAvailabilityRange = () => mathsStatisticsSpread(
  data.usage
);

tick();
