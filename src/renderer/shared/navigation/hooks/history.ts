import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationRegister } from '../context';
import { BreadcrumbNavigationHistoryItem } from '../types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Abstractable
const NAVIGATION_HISTORY_STORE_KEY = 'navigationHistory';

const getFrequentPaths = (
  history: string[],
) => {
  const frequency = history.reduce((acc, path) => ({
    ...acc,
    [path]: (acc[path] || 0) + 1,
  }), {} as Record<string, number>);
  const mostFrequentPaths = Object
    .entries(frequency)
    .map(([path, frequency]) => ({ path, frequency }))
    .sort((a, b) => b.frequency - a.frequency)
    .map(({ path }) => path)
    .slice(0, 20)
  ;
  return mostFrequentPaths;
};

const store = create<{
  history: string[];
  addHistory: (pathname: string) => void;
}>()(persist((set) => ({
  history: [],
  addHistory: (pathname) => set((state) => ({
    history: [pathname, ...state.history],
  })),
}), {
  name: NAVIGATION_HISTORY_STORE_KEY, // Key in LocalStorage
}));

// End abstractable.

export const useNavigationHistory = () => {
  const { pathname } = useLocation();
  const { map, loading } = useNavigationRegister();
  const { history, addHistory } = store();

  const frequent = useMemo(
    () => getFrequentPaths(history),
    [history]
  );

  const { items, readyPaths } = useMemo(() => frequent.reduce<{
    items: BreadcrumbNavigationHistoryItem[],
    readyPaths: string[]
  }>((acc, path) => {
    const item = map[path];
    if (item) return { ...acc, items: [...acc.items, item] };
    return { ...acc, readyPaths: [...acc.readyPaths, path] };
  }, { items: [], readyPaths: [] }), [frequent, map]);

  useEffect(() => {
    addHistory(pathname);
  }, [addHistory, pathname]);

  useEffect(() => {
    readyPaths.forEach((path) => {
      loading(path);
    });
  }, [loading, readyPaths]);

  return items;
};
