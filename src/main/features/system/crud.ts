import * as os from 'node:os';
import { getCpuUsage } from './cpu';

export const checkResources = async (): Promise<{
  cpuUsage: number;
  memoryFreePercentage: number;
}> => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryFreePercentage = (freeMemory / totalMemory);

  const cpuUsage = getCpuUsage();

  return { cpuUsage, memoryFreePercentage };
};
