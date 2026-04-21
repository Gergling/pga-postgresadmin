import * as os from 'node:os';
import { getCpuUsage } from './cpu';

export const checkResources = async (): Promise<{
  cpuAvailable: number;
  memoryFreePercentage: number;
}> => {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryFreePercentage = (freeMemory / totalMemory);

  const cpuAvailable = getCpuUsage();

  return { cpuAvailable, memoryFreePercentage };
};
