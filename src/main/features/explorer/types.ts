import { ExplorerFileRecordAction } from "@/shared/features/explorer";

export type DiskDriveCapacityExtractionRaw<T = number> = {
  free: T;
  used: T;
  size: T;
};

export type DiskDriveCapacityExtractionProportional<T = number> = {
  free: T;
  used: T;
};

export type DiskDriveCapacityExtraction = {
  formatted: {
    gb: DiskDriveCapacityExtractionRaw<string>;
    pc: DiskDriveCapacityExtractionProportional<string>;
  };
  proportional: DiskDriveCapacityExtractionProportional;
  raw: DiskDriveCapacityExtractionRaw;
};

export type ExplorerUsageProgressSnapshot = {
  scanned: number;
  total: number;
  usage: number;
  proportion: number;
  formatted: string;
  action: Record<ExplorerFileRecordAction, number>;
};
