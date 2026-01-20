import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const NAVIGATION_HISTORY_STORE_KEY = 'navigationHistory';

export const useNavigationHistory = () => {
  const { pathname } = useLocation();

  const history = useMemo(
    () => {
      const historyStr = localStorage.getItem(NAVIGATION_HISTORY_STORE_KEY);
      const history = JSON.parse(historyStr || '[]') as string[];
      const updatedHistory = [pathname, ...history].slice(0, 20)
      const frequency = updatedHistory.reduce((acc, path) => ({
        ...acc,
        [path]: (acc[path] || 0) + 1,
      }), {} as Record<string, number>);
      const mostFrequentPaths = Object
        .entries(frequency)
        .map(([path, frequency]) => ({ path, frequency }))
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 5)
        .map(({ path }) => path)
      ;
      const updatedStr = JSON.stringify(mostFrequentPaths);

      localStorage.setItem(NAVIGATION_HISTORY_STORE_KEY, updatedStr);
      return mostFrequentPaths;
    },
    [pathname]
  );

  return history;
};
