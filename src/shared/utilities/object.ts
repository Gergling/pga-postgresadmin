type Key = string | number | symbol;

type Reducer<T, K> = (acc: T, key: K) => T;

export const reduceInitialObject = <
  K extends Key = Key,
  U = unknown,
  T extends Record<K, U> = Record<K, U>,
>(
  arr: readonly K[],
  value?: Reducer<T, K> | U,
): T => arr.reduce<T>(
  (acc, key) => {
    if (typeof value === 'function') return (value as Reducer<T, K>)(acc, key);

    return { ...acc, [key]: value };
  },
  {} as T
);

// This is explicitly intended to take "any"-typed parameters.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepMerge = <T>(target: any, source: any): T => {
  // If either is not an object (or is null), return the source (overwrite/value)
  if (typeof target !== 'object' || !target || typeof source !== 'object' || !source) {
    return source;
  }

  const output = { ...target };

  Object.keys(source).forEach((key) => {
    output[key] = deepMerge(output[key], source[key]);
  });

  return output;
};
