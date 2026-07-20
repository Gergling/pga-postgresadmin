import { MathsStatisticsSpread } from "@/shared/types";

export const interpolate = (
  input: number,
  inputMinimum: number,
  inputMaximum: number,
  outputMinimum: number,
  outputMaximum: number
): number => {
  if (input <= inputMinimum) return outputMinimum;
  if (input >= inputMaximum) return outputMaximum;

  const inputRange = inputMaximum - inputMinimum;
  const inputScaled = input / inputRange;
  const outputRange = outputMaximum - outputMinimum;
  const outputScaled = inputScaled * outputRange;
  const interpolated = outputMinimum + outputScaled;
  return interpolated;
};

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

export const mathsStatisticsSpread = (series: number[]): MathsStatisticsSpread => {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = Math.abs(max - min);
  const dispersion = range === 0 ? 0 : range / Math.max(Math.abs(min), Math.abs(max));
  return { max, min, range, dispersion };
};
