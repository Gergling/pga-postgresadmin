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
