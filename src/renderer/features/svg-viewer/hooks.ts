import { useMemo } from "react";
import { SIZE_CONFIG, SizeName } from "./config/neon";

let id = 0;

const padding = 20;

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
  const start = -padding;
  const end = n + padding;
  const viewBox = `${start} ${start} ${end} ${end}`;
  // const viewBox = `0 0 ${n} ${n}`;
  const offset = -padding / 2;
  const translation = (n / 2) + offset;
  return {
    viewBox, width: end, height: end, translation,
    visible: { // Junk it
      width: n,
      height: n,
    },
    container: {
      width: n,
      height: n,
    },
    offset: {
      top: offset,
      left: offset,
    }
  };
}, [size]);
