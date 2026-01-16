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
