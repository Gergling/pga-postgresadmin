import checkDiskSpace from 'check-disk-space';
import { LogApi } from "@/main/shared";
import { explorerCapacity } from "../crud";
import { extractFileMetadata } from "./data";
import { DiskDriveCapacityExtraction } from '../types';

const { read: readExplorerCapacity } = explorerCapacity();
// const { read: readExplorerFileCount } = explorerFileCount();

const getCachedValues = async ({ log }: LogApi) => {
  const capacity = await log(
    'Checking cache for drive capacity', readExplorerCapacity
  );
  return { capacity };
};

const extractDiskCapacity = async ({ log }: LogApi) => log(
  'Extracting disk capacity', async () => {
    const {
      blockSize, blocks
    } = await extractFileMetadata('/');
    return blockSize * blocks;
  }
);

export const readExplorerDriveData = async (props: LogApi) => {
  const cache = await getCachedValues(props);

  const capacity = cache.capacity ?? await extractDiskCapacity(props);
  // const fileCount = cache.fileCount ? cache.fileCount : extractWindowsFileCount(props);

  // task('Counting files', extractWindowsFileCount)
  return { capacity };
};

export const extractDiskDriveCapacity = async (
  driveLetter: string = 'C:'
): Promise<DiskDriveCapacityExtraction> => {
  const { free, size } = await checkDiskSpace(`${driveLetter}\\`);
  const used = size - free;
  const gb = {
    free: free / (1024 ** 3),
    used: used / (1024 ** 3),
    size: size / (1024 ** 3),
  };
  const proportional = {
    free: free / size,
    used: used / size,
  };
  const formatted = {
    gb: {
      free: `${gb.free.toFixed(2)}GB`,
      used: `${gb.used.toFixed(2)}GB`,
      size: `${gb.size.toFixed(2)}GB`,
    },
    pc: {
      free: `${(proportional.free * 100).toFixed(2)}%`,
      used: `${(proportional.used * 100).toFixed(2)}%`,
    }
  };

  return {
    formatted,
    proportional,
    raw: { free, used, size },
  };
};

// export async function getWindowsDiskUsage(driveLetter: string = 'C:') {
//   try {
//     // Pass the path (e.g., 'C:') to fetch information
//     const diskSpace = await checkDiskSpace(`${driveLetter}\\`);

//     const totalGB = (diskSpace.size / (1024 ** 3)).toFixed(2);
//     const freeGB = (diskSpace.free / (1024 ** 3)).toFixed(2);
//     const usedGB = ((diskSpace.size - diskSpace.free) / (1024 ** 3)).toFixed(2);

//     console.log(`Drive: ${driveLetter}`);
//     console.log(`Total Space: ${totalGB} GB`);
//     console.log(`Free Space:  ${freeGB} GB`);
//     console.log(`Used Space:  ${usedGB} GB`);
//   } catch (error) {
//     console.error('Failed to retrieve disk space:', error);
//   }
// }
