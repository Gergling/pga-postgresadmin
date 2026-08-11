export function boxMullerTransform(u: number, v: number): number {
  // Prevent Math.log(0) which results in -Infinity
  if (u <= 0 || u >= 1) throw new Error("Argument 'u' must be strictly between 0 and 1 (exclusive of 0).");
  if (v < 0 || v > 1) throw new Error("Argument 'v' must be between 0 and 1.");

  // Apply the Box-Muller calculus
  const magnitude = Math.sqrt(-2.0 * Math.log(u));
  const phase = 2.0 * Math.PI * v;

  // You can return either Math.cos(phase) or Math.sin(phase). Both provide valid independent normal variables.
  return magnitude * Math.cos(phase);
}

export const sum = (series: number[]) => {
  const sum = series.reduce((acc, value) => acc + value, 0);
  return sum;
};

export const mean = (series: number[]) => {
  const mean = sum(series) / series.length;
  return mean;
};

/**
 * Takes a median from a series of numbers.
 * @param series The numbers to find the median for.
 * @param sort Defaults to true. If the numbers are already sorted, this can be set to false to
 * avoid an unnecessary operation.
 * @returns The median as a number.
 */
export const median = (series: number[], sort = true) => {
  const length = series.length;
  const middle = length / 2;
  const sorted = sort ? series.sort() : series;
  const median = length % 2 === 0
    ? (sorted[middle] + sorted[middle - 1]) / 2
    : sorted[Math.floor(middle)]
    ;
  return median;
};

export type MathsStatisticsSpread = {
  max: number;
  min: number;
  dispersion: number;
  range: number;
};

export const mathsStatisticsSpread = (series: number[]): MathsStatisticsSpread => {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = Math.abs(max - min);
  const dispersion = range === 0 ? 0 : range / Math.max(Math.abs(min), Math.abs(max));
  return { max, min, range, dispersion };
};
