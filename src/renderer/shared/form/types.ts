export type WX<T, U extends Record<string, unknown> = never> = {
  props?: Partial<T>;
  children?: Partial<U>;
};
