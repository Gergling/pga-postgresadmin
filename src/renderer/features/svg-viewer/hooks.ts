let id = 0;

export const useUniqueId = <T extends string>(prefixes: T[]): Record<T, string> => {
  const newId = id++;
  return prefixes.reduce((acc, prefix) => {
    return {
      ...acc,
      [prefix]: `${prefix}-${newId}`,
    };
  }, {} as Record<T, string>);
};
