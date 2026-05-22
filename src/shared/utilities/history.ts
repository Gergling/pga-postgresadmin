export const getFrequentPaths = (
  history: string[],
  options: {
    size?: number;
  } = {},
) => {
  const { size = 5 } = options;
  const frequency = history.reduce((acc, path) => ({
    ...acc,
    [path]: (acc[path] || 0) + 1,
  }), {} as Record<string, number>);
  const mostFrequentPaths = Object
    .entries(frequency)
    .map(([path, frequency]) => ({ path, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .map(({ path }) => path)
    .slice(0, size)
  ;
  return mostFrequentPaths;
};
