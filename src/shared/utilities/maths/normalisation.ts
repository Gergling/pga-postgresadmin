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

export const boxMullerMagnitude = (seed: number): number => {
  const value = (seed + Number.MIN_VALUE) % 1;
  if (value === 0) return boxMullerMagnitude(0);
  return Math.sqrt(-2.0 * Math.log(value));
};
