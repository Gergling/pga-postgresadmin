import { QuestionMark } from "@mui/icons-material";
import { BreadcrumbHistoryRequestItemFunction, BreadcrumbNavigationHistoryItem, PathVisits } from "../types";
import { NAVIGATION_HISTORY_DISPLAYED, NAVIGATION_HISTORY_KEY_BASE, NAVIGATION_HISTORY_MAXIMUM_FREQUENCY } from "../constants";
import { RouteMatch } from "react-router-dom";
import { getObjectEntries } from "@/shared/utilities";
import { createElement } from "react";
import { Runetator } from "@/renderer/features/svg-viewer/components";

export const getFallbackHistoryItem = (path: string): BreadcrumbNavigationHistoryItem => ({
  icon: () => createElement(Runetator, { size: 'small', seedStr: path }),
  label: path.slice(0, 12) + '...',
  status: 'error',
  path,
});

export const getLoadingHistoryItem = (path: string): BreadcrumbNavigationHistoryItem => ({
  icon: QuestionMark,
  label: 'Loading...',
  status: 'request',
  path,
});

export const getNavigationHistoryKey = (
  path: string
) => [NAVIGATION_HISTORY_KEY_BASE, path];

export const requestHistoryItemFactory = (
  requestCallbacks: BreadcrumbHistoryRequestItemFunction[],
  matchRoutes: (path: string) => RouteMatch[] | null
) => async (path: string): Promise<BreadcrumbNavigationHistoryItem> => {
  // If it doesn't match any nodes, fallback.
  const matches = matchRoutes(path);
  if (!matches) {
    console.warn(`No match found for path: ${path}`);
    return getFallbackHistoryItem(path);
  }

  // If a match is found, run the request and return the result.
  const match = matches[matches.length - 1];
  const results = await Promise.allSettled(requestCallbacks.map((requestItem) => requestItem(match)));
  const result = results.find((result) => result.status === 'fulfilled');
  if (result && result.value) return { path, ...result.value };

  // If there is no result, throw.
  console.warn(`No result found for path: ${path}`);
  return getFallbackHistoryItem(path);
}

export const getFrequentPaths = (
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
    .slice(0, NAVIGATION_HISTORY_DISPLAYED)
    ;
  return mostFrequentPaths;
};

export const getDisplayedPaths = (
  visits: PathVisits
): string[] => getObjectEntries(visits)
  .map(([path, frequency]) => ({ path, frequency }))
  .sort((a, b) => b.frequency - a.frequency)
  .map(({ path }) => path)
  .slice(0, NAVIGATION_HISTORY_DISPLAYED);

export const addVisitReducer = (
  stateVisits: PathVisits, pathname: string
): PathVisits => {
  // Increment the number of visits for this path.
  const visits = {
    ...stateVisits,
    [pathname]: (stateVisits[pathname] ?? 0) + 1
  };

  // Transform into an array and keep running total of visits.
  const { list, total } = Object.entries(visits).reduce(
    (acc, [path, frequency]) => ({
      ...acc,
      list: [...acc.list, { frequency, path }],
      total: acc.total + frequency,
    }), { list: [], total: 0 }
  );

  // Sort paths by descending visit frequency.
  const sortedByDescFrequency = list.sort((a, b) => b.frequency - a.frequency);

  // Calculate the number of visits more than we feel the need to store. 
  // For this, we subtract the maximum frequency we want to keep for obvious
  // reasons.
  // In addition, we also add in product of the displayed history and 2. I don't
  // remember exactly why I wanted to do this, but I assume it's something to do
  // with separating the representation of recent navigation behaviour from the
  // number of displayed items.
  const overflow = total - NAVIGATION_HISTORY_MAXIMUM_FREQUENCY + (NAVIGATION_HISTORY_DISPLAYED * 2);

  // At this point, we can perform some clean-up. If we have a lot of visits, we
  // can decrement the visits for each path, while removing path visits
  // decremented to 0.
  if (overflow > NAVIGATION_HISTORY_DISPLAYED) {
    return sortedByDescFrequency.reduce(
      (acc, { frequency, path }, idx) => {
        // We always want to keep the first displayed history items, even if we
        // haven't visited them in a while.
        if (idx > NAVIGATION_HISTORY_DISPLAYED && frequency <= 0) return acc;
        return {
          ...acc,
          // We do not want to decrement below 0.
          [path]: frequency > 0 ? frequency - 1 : 0,
        };
      }, {} as Record<string, number>
    );
  }

  return sortedByDescFrequency.reduce(
    (acc, { frequency, path }) => ({
      ...acc,
      [path]: frequency,
    }), {} as Record<string, number>
  );
};
