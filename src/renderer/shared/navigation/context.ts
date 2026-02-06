import { contextFactory } from "@gergling/ui-components";
import { PropsWithChildren, useCallback, useEffect, useMemo } from "react";
import { create } from "zustand";
import { Optional } from "../../../shared/types";
import { BreadcrumbHistoryRequestItemFunction, BreadcrumbNavigationHistoryItem } from "./types";
import { getFallbackHistoryItem, getLoadingHistoryItem, getNavigationHistoryKey, requestHistoryItemFactory } from "./utilities";
import { useQueries, UseQueryOptions } from "@tanstack/react-query";

const store = create<{
  addCallback: (requestItem: BreadcrumbHistoryRequestItemFunction) => void;
  error: (path: string) => void;
  loading: (path: string) => void;
  map: Record<string, BreadcrumbNavigationHistoryItem>;
  register: (item: Optional<BreadcrumbNavigationHistoryItem, 'status'>) => void;
  removeCallback: (requestItem: BreadcrumbHistoryRequestItemFunction) => void;
  requestCallbacks: BreadcrumbHistoryRequestItemFunction[];
}>((set) => ({
  addCallback: (requestItem) => set((state) => ({
    requestCallbacks: [...state.requestCallbacks, requestItem],
  })),
  error: (path) => set((state) => ({
    map: { ...state.map, [path]: getFallbackHistoryItem(path) },
  })),
  loading: (path) => set((state) => ({
    map: { ...state.map, [path]: getLoadingHistoryItem(path) },
  })),
  map: {},
  register: (item) => set((state) => ({
    map: { ...state.map, [item.path]: { status: 'success', ...item } },
  })),
  requestCallbacks: [],
  removeCallback: (requestItem) => set((state) => ({
    requestCallbacks: state.requestCallbacks.filter((item) => item !== requestItem),
  })),
}));

export const {
  Provider: NavigationRegisterProvider,
  useContextHook: useNavigationRegister,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
} = contextFactory((_: PropsWithChildren) => {
  // Store setup.
  const {
    addCallback, removeCallback,
    error, loading, register,
    map,
    requestCallbacks,
  } = store();

  // A simple array of all the mapped items.
  const items = useMemo(() => Object.values(map), [map]);

  // All items which are ready for an asynchronous load.
  const requestPaths = useMemo(() => items
    .filter(({ status }) => status === 'request')
    .map(({ path }) => path),
    [items]
  );

  // We need to do the async call *first* and the state update *second*.
  // Each time we want a path, we ask for the path using a sync function.
  // It either returns what's there or a placeholder for one that's loading.
  const request = useCallback(requestHistoryItemFactory(requestCallbacks), [requestCallbacks]);

  // Load up all ready items.
  const queries = useQueries({
    queries: requestPaths.map((path): UseQueryOptions<BreadcrumbNavigationHistoryItem, Error, BreadcrumbNavigationHistoryItem, readonly unknown[]> => ({
      queryFn: () => request(path),
      queryKey: getNavigationHistoryKey(path),
    })),
    combine: (results) => results.map((result, index) => ({
      ...result,
      path: requestPaths[index], 
    })),
  });

  // Build the subscribe function
  const subscribe = useCallback((requestItem: BreadcrumbHistoryRequestItemFunction) => {
    addCallback(requestItem);
    return () => removeCallback(requestItem);
  }, [addCallback, removeCallback]);

  useEffect(() => {
    queries.forEach(({ data, error: errorMessage, isError, path }) => {
      if (isError) {
        error(path);
        console.warn(`Error loading path: ${path}`, errorMessage);
        return;
      }
      if (!data) return;
      register(data);
    });
  }, [error, queries, register]);

  return {
    loading, register,
    items, map,
    request, subscribe,
  };
}, 'navigation-register');
