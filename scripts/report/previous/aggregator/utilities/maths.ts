export const getMean = (values: number[]) => {
  const denominator = values.length;
  if (denominator === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / denominator;
};
