const getEntry = <T, U>([key, value]: [string, U]) => ({ key: key as T, value });

const getEntryFactory = <T>() => getEntry;

const someObject = {};
Object.entries(someObject).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

const reduceEntries = <T extends string | number | symbol, U, V>(
  obj: Record<T, U>,
  reducer: (acc: V, value: U, key: T) => V,
  initialValue: V = {} as V
): V => {
  const keys = Object.keys(obj);
  return keys.reduce<V>(
    (acc, keyAny) => {
      const key = keyAny as T;
      const value = obj[key];
      return reducer(acc, value, key);
    },
    initialValue
  );
};

// reduceEntries({ x: 1, y: 2, z: 3 }, (acc, value, key) => [...acc, value]);
