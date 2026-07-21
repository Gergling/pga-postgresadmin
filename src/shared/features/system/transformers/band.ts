// import { CPUUsage, MemoryUsage } from "@/main/features/system/schemas";
// import { SYSTEM_CPU_BANDS, SYSTEM_MEMORY_BANDS } from "../config";

// import z from "zod";
import {
  BandConfig,
  SYSTEM_CPU_BANDS,
  SYSTEM_MEMORY_BANDS,
  SystemComputeColor
} from "../config";

// export const getBand = <T extends string>(
//   value: number,
//   bands: Record<T, { minimum: number; maximum: number }>
// ): T => Object.entries(bands).find(([_, band]) => band.minimum <= value && value < band.maximum)?.[0] || 'red';

// export const getMemoryBand = (usage: MemoryUsage): string => getBand(
//   usage.percentageUsed,
//   SYSTEM_MEMORY_BANDS
// );

// export const getCpuBand = (usage: CPUUsage): string => getBand(
//   usage.percentageUsed,
//   SYSTEM_CPU_BANDS
// );

// const computeBandParamsOptionsSchema = z.object({
//   type: z.union([z.literal('usage'), z.literal('free')]).default('free').optional(),
//   value: z.number(),
// });

export const getSystemBand = (
  availability: number, bandConfig: BandConfig[]
) => bandConfig.find(
  ({ minimum, maximum }) => minimum <= availability && availability <= maximum
);

// const computeBandParamsSchema = z.object({
//   cpu: computeBandParamsOptionsSchema,
//   memory: computeBandParamsOptionsSchema,
// });

// type ComputeBandParams = z.infer<typeof computeBandParamsSchema>;

// export type ComputeBandResult = 'green' | 'yellow' | 'amber' | 'red' | 'grey';

export const getComputeBand = (
  cpu: SystemComputeColor | undefined,
  memory: SystemComputeColor | undefined
): SystemComputeColor => {
  if (!cpu || !memory) return 'grey';
  if (cpu === 'grey' || memory === 'grey') return 'grey';
  if (cpu === 'red' || memory === 'red') return 'red';
  if (cpu === 'green') return 'green';
  if (memory === 'yellow') return 'amber';
  return 'yellow';
};

export const getSystemBands = (cpu: number, memory: number) => {
  const cpuBand = getSystemBand(cpu, SYSTEM_CPU_BANDS)?.color || 'grey';
  const memoryBand = getSystemBand(memory, SYSTEM_MEMORY_BANDS)?.color || 'grey';
  const compute = getComputeBand(cpuBand, memoryBand);
  return {
    cpu: cpuBand,
    memory: memoryBand,
    compute,
  };
};

