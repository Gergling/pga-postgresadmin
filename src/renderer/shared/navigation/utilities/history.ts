import { QuestionMark } from "@mui/icons-material";
import { BreadcrumbHistoryRequestItemFunction, BreadcrumbNavigationHistoryItem } from "../types";
import { NavigationLoadingHistoryIcon } from "../components";
import { matchRoutes } from "../hooks";

export const getNavigationHistoryKey = (path: string) => ['navigation-history', path];

export const getFallbackHistoryItem = (path: string): BreadcrumbNavigationHistoryItem => ({
  icon: QuestionMark,
  label: '(Unknown)',
  status: 'error',
  path,
});

export const getLoadingHistoryItem = (path: string): BreadcrumbNavigationHistoryItem => ({
  icon: NavigationLoadingHistoryIcon,
  label: 'Loading...',
  status: 'loading',
  path,
});

export const requestHistoryItemFactory = (
  requestCallbacks: BreadcrumbHistoryRequestItemFunction[]
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
  if (result) return { path, ...result.value };

  // If there is no result, throw.
  console.warn(`No result found for path: ${path}`);
  return getFallbackHistoryItem(path);
}
