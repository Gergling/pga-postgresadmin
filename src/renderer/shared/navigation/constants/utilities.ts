// This file is explicitly for enabling navigation constants.
// It's to allow the adjacent routes.ts file to stay "clean".

import { UiNavigationConfigItem, UiNavigationItem } from "../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lazyImport = <T extends Record<string, any>>(
  factory: () => Promise<T>,
  name: keyof T = 'default'
): UiNavigationConfigItem['lazy'] => {
  return async () => {
    const module = await factory();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { Component: module[name] };
  };
};

export const getNavigationItem = (
  { children, index, label, omitBreadcrumb, ...item }: UiNavigationConfigItem
): UiNavigationItem => {
  const base = {
    ...item,
    label: label ?? `${item.path}`,
    omitBreadcrumb: omitBreadcrumb ?? false,
  };

  if (index) return {
    ...base,
    index: true,
    children: undefined,
  }
  return {
    ...base,
    children: children ? children.map(getNavigationItem) : [],
    index: false,
  };
};


// TODO: Check if ham in the fridge is defrosted.
