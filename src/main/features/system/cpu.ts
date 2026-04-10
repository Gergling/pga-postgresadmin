import { median } from "@shared/utilities";
import { wait } from "@shared/utilities/timeout";
import * as os from 'node:os';
import { summariseCpuUsage } from "./utilities";

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

/**
 * 
 * @returns The median CPU usage in the last minute.
 */
export const getCpuUsage = () => {
  return median(data.usage);
};

tick();
