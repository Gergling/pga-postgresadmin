import * as os from 'node:os';

export const summariseCpuUsage = (
  cpus: os.CpuInfo[]
) => cpus.reduce((acc, core) => {
  const total = Object.values(core.times).reduce(
    (total, value) => total + value, 0
  );
  return acc + (core.times.idle / total);
}, 0) / cpus.length;
