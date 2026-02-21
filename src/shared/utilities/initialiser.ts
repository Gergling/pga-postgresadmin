export const hydratorFactory = <T extends object>({
  initial,
  initialiser
}: {
  initial: T;
  initialiser?: (value?: Partial<T>) => Partial<T>;
}) => (value?: Partial<T>): T => {
  const initialised = initialiser ? initialiser(value) : value;
  return {
    ...initial,
    ...initialised,
  };
};
