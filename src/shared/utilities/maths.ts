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
