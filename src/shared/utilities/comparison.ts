export type Comparator<T> = (a: T, b: T) => number;

export const comparatorFactory = <T>() => {
  type SpecialComparator = Comparator<T>;

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

  const stack = (
    comparators: SpecialComparator[]
  ): SpecialComparator => (a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b);
      if (result !== 0) return result;
    }
    return 0;
  };

  return { create, flip, rank, stack };
};