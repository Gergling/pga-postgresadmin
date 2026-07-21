import { getSystemBands } from "@/shared/features/system";
import {
  extractSystemMemory,
  getCpuFreeMean
} from "@/main/features/system";

export const extractExplorerPriority = (recentSeconds: number) => {
  const cpuFree = getCpuFreeMean(recentSeconds);
  const { memoryFreePercentage } = extractSystemMemory();
  return getSystemBands(cpuFree, memoryFreePercentage).compute;
};
