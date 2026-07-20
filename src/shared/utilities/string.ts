export const medianDiscrete = <T extends string>(
  series: T[],
  order: readonly T[]
): T => {
  const length = series.length;
  const middle = length / 2;
  const sorted = [...series].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );
  if (length % 2 === 0) return sorted[middle];
  return sorted[Math.floor(middle)];
};
