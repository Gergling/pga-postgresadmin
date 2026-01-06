import { useMemo, useCallback } from 'react';

export function useStoredView<T extends string = string>(level: string, defaultView: T) {
  const baseKey = useMemo(() => `route-${level}`, [level]);
  const storedView = useMemo(
    () => (localStorage.getItem(baseKey) || defaultView) as T,
    [baseKey, defaultView]
  );
  const setStoredView = useCallback(
    (value: T) => localStorage.setItem(baseKey, value),
    [baseKey]
  );

  return { setStoredView, storedView };
}
