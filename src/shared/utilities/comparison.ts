import { Mandatory, Swap } from "../types";
import { getObjectEntries } from "./object";

export type Comparator<T> = (a: T, b: T) => number;

type MapFnc<T> = <To>(
  fn: (from: T) => To, comparator: Comparator<To>
) => Comparator<T>

type ConfigItem<T> = {
  comparator: Comparator<T>;
  map: <To>(from: T) => To;
};

const initialiseConfigItem = <T>(
  item: Mandatory<ConfigItem<T>, 'comparator'>
): ConfigItem<T> => ({
  map: <To>(from: T): To => from as unknown as To,
  ...item,
});

export const compareUndefinedAsc = (a?: unknown, b?: unknown): number => {
  if (!a) {
    if (!b) return 0;
    return -1;
  }
  if (!b) return 1;
  return 0;
};

export const compareAlphabeticalAsc: Comparator<string> = (
  a, b
) => a.localeCompare(b);

export const flipComparator = <T>(
  comparator: Comparator<T>
): Comparator<T> => (a, b) => comparator(b, a);

export class ComparatorFactory<T> {
  constructor(private comparator: Comparator<T>) { }

  sort(values: T[]) { return [...values].sort((a, b) => this.comparator(a, b)); }
  run(a: T, b: T) { return this.comparator(a, b); }

  flip = () => new ComparatorFactory<T>((
    a, b
  ) => this.comparator(b, a));

  rank = (ranking: T[]) => new ComparatorFactory<T>((
    a, b
  ) => ranking.indexOf(a) - ranking.indexOf(b));

  from = <From>(
    mapper: (params: From) => T
  ) => new ComparatorFactory<From>(
    (a, b) => this.comparator(mapper(a), mapper(b))
  );

  static stack = <T>(
    instances: ComparatorFactory<T>[]
  ): ComparatorFactory<T> => {
    return new ComparatorFactory((a, b) => {
      for (const instance of instances) {
        const result = instance.run(a, b);
        if (result !== 0) return result;
      }
      return 0;
    });
  }

  static instantiate(params?: 'number'): ComparatorFactory<number>;
  static instantiate(params: 'string'): ComparatorFactory<string>;
  static instantiate<T>(
    params:
      | Comparator<T>
      | ComparatorFactory<T>
      | (Comparator<T> | ComparatorFactory<T>)[]
  ): ComparatorFactory<T>;
  static instantiate<T>(
    params?:
      | Comparator<T>
      | ComparatorFactory<T>
      | (Comparator<T> | ComparatorFactory<T>)[]
      | 'string' | 'number'
  ) {
    if (Array.isArray(params)) return ComparatorFactory.stack(params.map(
      (param) => ComparatorFactory.instantiate(param)
    ));
    if (typeof params === 'function') {
      return new ComparatorFactory(params)
    };
    if (params === 'string') return new ComparatorFactory(compareAlphabeticalAsc);
    return new ComparatorFactory((a: number, b: number) => a - b);
  }

  static maps<T>(mappers: ((params: T) => number)[]) {
    return mappers.map(
      ComparatorFactory.instantiate().from<T>
    );
  }
}

/**
 * @deprecated Use ComparatorFactory instead.
 * @param config 
 * @returns 
 */
export const comparatorFactory = <T, U extends string = string>(
  config: Record<U, Comparator<T> | ConfigItem<T>> = {} as Record<U, ConfigItem<T>>
) => {
  type SpecialComparator = Comparator<T>;
  type ActualConfig = Record<U, ConfigItem<T>>;

  const actualConfig = getObjectEntries(config).reduce(
    (acc, [key, item]) => {
      if (typeof item === 'function') return {
        ...acc,
        [key]: initialiseConfigItem({
          comparator: item
        })
      }
      return {
        ...acc,
        [key]: initialiseConfigItem(item)
      }
    },
    {} as ActualConfig
  );

  const create = (comparator: SpecialComparator): SpecialComparator => comparator;

  const flip = (
    direction: 'asc' | 'desc', ascComparator: SpecialComparator
  ): SpecialComparator => (a, b) => {
    if (direction === 'asc') return ascComparator(a, b);
    return ascComparator(b, a);
  };

  const rank = (
    ranking: T[],
  ): SpecialComparator => (a, b) => ranking.indexOf(a) - ranking.indexOf(b);

  const map: MapFnc<T> = <To>(
    fn: (from: T) => To, comparator: Comparator<To>
  ): Comparator<T> => (a, b) => comparator(fn(a), fn(b));

  const stack = (
    items: SpecialComparator[]
  ): SpecialComparator => (a, b) => {
    for (const item of items) {
      const result = item(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };

  return { config: actualConfig, create, flip, rank, stack, map };
};