import { medianDiscrete, wait } from "@/shared/utilities";
import { getComputeBand, getSystemBands } from "@/shared/features/system";
import { ANSI_COLOUR_MAP, AnsiColourCode, log } from "@/main/shared";
import {
  getCpuUsage,
  getTrendingFreeMemory
} from "../extractors";
import { SYSTEM_COMPUTE_COLOR_ORDER, SystemComputeColor } from "../config";

const data: { compute: SystemComputeColor[]; } = {
  compute: [],
};

const mapSystemComputeBandToAnsiCode = (
  compute: SystemComputeColor
): AnsiColourCode => {
  switch (compute) {
    case 'green':
    case 'yellow':
    case 'red':
      return compute;
    case 'amber': return 'hiRed';
    default: return 'hiWhite';
  }
}

const getComputeMessage = (
  current: SystemComputeColor,
  previous: SystemComputeColor | undefined
) => {
  if (current === previous) return '';
  const currentColourCode = mapSystemComputeBandToAnsiCode(current);
  if (previous === undefined) return [
    `Initialised System Monitoring Compute Band: `,
    ANSI_COLOUR_MAP[currentColourCode],
    current,
    ANSI_COLOUR_MAP.reset,
  ].join('');
  const previousColourCode = mapSystemComputeBandToAnsiCode(previous);
  return [
    `Compute band changed from `,
    ANSI_COLOUR_MAP[previousColourCode],
    previous,
    ANSI_COLOUR_MAP.reset,
    ` to `,
    ANSI_COLOUR_MAP[currentColourCode],
    current,
    ANSI_COLOUR_MAP.reset,
  ].join('');
};

const tick = async () => {
  const cpu = getCpuUsage();
  const memory = getTrendingFreeMemory();
  const { compute: band, cpu: cpuBand, memory: memoryBand } = getSystemBands(cpu, memory);
  // console.log(cpu, cpuBand, memory, memoryBand)
  const previous = data.compute.length
    ? medianDiscrete(data.compute, SYSTEM_COMPUTE_COLOR_ORDER)
    : undefined;
  data.compute = [...data.compute, band].slice(-4);
  const current = medianDiscrete(data.compute, SYSTEM_COMPUTE_COLOR_ORDER);
  const message = getComputeMessage(current, previous);
  if (message) {
    if (current === 'red') {
      log([
        message, ANSI_COLOUR_MAP.cyan,
        ', CPU: ', ANSI_COLOUR_MAP[mapSystemComputeBandToAnsiCode(cpuBand)],
        cpuBand, ANSI_COLOUR_MAP.cyan,
        ', Memory: ', ANSI_COLOUR_MAP[mapSystemComputeBandToAnsiCode(memoryBand)],
        memoryBand, ANSI_COLOUR_MAP.cyan,
      ].join(''));
    } else {
      log(message);
    }
  }
  await wait(5000);
  tick();
};

tick();
