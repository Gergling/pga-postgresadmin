import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigationRegister } from '../context';
import { BreadcrumbNavigationHistoryItem, PathVisits } from '../types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addVisitReducer, getDisplayedPaths, getFrequentPaths } from '../utilities';
import { NAVIGATION_HISTORY_MAXIMUM_FREQUENCY } from '../constants';

// Abstractable
const NAVIGATION_HISTORY_STORE_KEY = 'navigationHistory';

// WHAT IF we "map" (record, cos serialisation) to a path an incremented number.
// We visit once, and it is set to 1. If it already exists, we increment.
// Recent visits: We count the number of items with a minimum of 1.
// Total visits: We sum the number of visits across all items.
// Overflow: Total visits - MAXIMUM_FREQUENCY + (DISPLAYED_HISTORY * 2).
// After adding, if overflow > DISPLAYED_HISTORY, we should run a cutback.
// First of all, anything beyond an index of DISPLAYED_HISTORY with < 0 visits is deleted.
// Second, decrement every item by 1.

// Items are still ordered by frequency.

const store = create<{
  history: string[];
  addHistory: (pathname: string) => void;
  visits: PathVisits;
  displayed: string[];
  addVisit: (pathname: string) => void;
}>()(persist((set) => ({
  displayed: [],
  history: [],
  visits: {},
  /**
   * @deprecated Use addVisit.
   * @param pathname 
   * @returns 
   */
  addHistory: (pathname) => set((state) => {
    const visits = addVisitReducer(state.visits, pathname);
    const displayed = getDisplayedPaths(visits);
    return {
      displayed,
      // TODO: Ideally needs a system for keeping the first DISPLAYED_HISTORY unique paths as well.
      history: [pathname, ...state.history].slice(0, NAVIGATION_HISTORY_MAXIMUM_FREQUENCY),
      visits,
    };
  }),
  addVisit: (pathname) => set((state) => {
    const visits = addVisitReducer(state.visits, pathname);
    const displayed = getDisplayedPaths(visits);
    return { displayed, visits };
  }),
}), {
  name: NAVIGATION_HISTORY_STORE_KEY, // Key in LocalStorage
}));

// End abstractable.

export const useNavigationHistory = () => {
  const { pathname } = useLocation();
  const { map, loading } = useNavigationRegister();
  const { addHistory, displayed } = store();

  const { items, readyPaths } = useMemo(() => displayed.reduce<{
    items: BreadcrumbNavigationHistoryItem[],
    readyPaths: string[]
  }>((acc, path) => {
    const item = map[path];
    if (item) return { ...acc, items: [...acc.items, item] };
    return { ...acc, readyPaths: [...acc.readyPaths, path] };
  }, { items: [], readyPaths: [] }), [displayed, map]);

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
