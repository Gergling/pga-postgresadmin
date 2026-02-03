import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationRegister } from '../context';
import { BreadcrumbNavigationHistoryItem } from '../types';

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

export const useNavigationHistory = () => {
  const { pathname } = useLocation();
  const { map, ready } = useNavigationRegister();

  const frequent = useMemo(
    () => {
      const historyStr = localStorage.getItem(NAVIGATION_HISTORY_STORE_KEY);
      const history = JSON.parse(historyStr || '[]') as string[];
      const updatedHistory = [pathname, ...history];
      const mostFrequentPaths = getFrequentPaths(updatedHistory);
      const updatedStr = JSON.stringify(mostFrequentPaths);

      localStorage.setItem(NAVIGATION_HISTORY_STORE_KEY, updatedStr);

      return mostFrequentPaths;
    },
    [pathname]
  );

  const { items, readyPaths } = useMemo(() => frequent.reduce<{
    items: BreadcrumbNavigationHistoryItem[],
    readyPaths: string[]
  }>((acc, path) => {
    const item = map[path];
    console.log('frequent reduce', path, item, map)
    if (item) return { ...acc, items: [...acc.items, item] };
    return { ...acc, ready: [...acc.readyPaths, path] };
  }, { items: [], readyPaths: [] }), [frequent, map]);

  useEffect(() => {
    readyPaths.forEach((path) => {
      ready(path);
    });
  }, [ready, readyPaths]);

  return items;
};
