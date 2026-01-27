import { useMemo } from "react";
import { SIZE_CONFIG, SizeName } from "./config/neon";

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

export const useSize = (size: SizeName) => useMemo(() => {
  const n = SIZE_CONFIG[size];
  const viewBox = `0 0 ${n} ${n}`;
  const translation = n / 2;
  return { viewBox, width: n, height: n, translation };
}, [size]);
