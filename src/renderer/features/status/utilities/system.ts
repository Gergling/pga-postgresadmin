import {
  getComputeBand,
  getSystemBands,
  SystemCheckResponse
} from "@/shared/features/system";

// Based on the system's available resources, this will choose indicate what
// display methods are in use.
const displayWhat = (
  system: SystemCheckResponse
) => {
  if (system.cpu.range.dispersion > 0.5) return 'CPU sparkline AND some memory stuff';
  if (system.memory.range.dispersion > 0.5) return 'Memory sparkline AND some cpu stuff';
  const {
    compute, cpu, memory,
  } = getSystemBands(system.cpu.mean, system.memory.mean);
  if (cpu !== memory) return 'CPU and memory values';
  return 'Compute band';
};
