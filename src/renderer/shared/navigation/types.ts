import { Optional } from "../../../shared/types";
import { LoaderFunction, RouteMatch, RouteObject } from "react-router-dom";

// Navigation config base
export type UiNavigationConfigItem<T extends string = string> = {
  element?: React.ComponentType;
  HydrateFallback?: RouteObject['HydrateFallback'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lazy?: () => Promise<{ Component: React.ComponentType<any> }>;
  loader?: LoaderFunction;
}

// Index logic
& ({
  children?: UiNavigationConfigItem[];
  index?: false;
} | {
  children?: undefined;
  index?: true;
}) 

// Breadcrumb logic
& ({
  icon: React.ComponentType;
  label: string;
  omitBreadcrumb?: false;
  path: T;
} | {
  // If the breadcrumb is being omitted, it won't be showing the icon and label.
  // HOWEVER, it may appear in the history.
  icon?: React.ComponentType;
  label?: string;
  omitBreadcrumb: true;
  path?: T;
});

export type UiNavigationItem =
  & Pick<UiNavigationConfigItem, 'element' | 'icon' | 'label' | 'lazy' | 'loader' | 'path'>
  & Required<Pick<UiNavigationConfigItem, 'omitBreadcrumb'>>
  & ({
    children: UiNavigationItem[];
    index: false;
  } | {
    children: undefined;
    index: true;
  });

export type BreadcrumbNavigationItem = {
  active: boolean;
  children: string[];
  current: boolean;
  icon: React.ComponentType;
  label: string;
  name: string;
  path: string;
};

type BreadcrumbNavigationHistoryItemBase = Pick<BreadcrumbNavigationItem, 'label' | 'path'>;
type BreadcrumbNavigationHistoryItemHardcoded = BreadcrumbNavigationHistoryItemBase
  & { type?: undefined; };
export type BreadcrumbNavigationHistoryItemParametric = BreadcrumbNavigationHistoryItemBase & {
  type: 'task';
  id: string;
};
export type BreadcrumbNavigationHistoryItemLocalStorage = 
  | BreadcrumbNavigationHistoryItemHardcoded
  | BreadcrumbNavigationHistoryItemParametric
;
export type BreadcrumbNavigationHistoryItem = 
  & Omit<BreadcrumbNavigationHistoryItemHardcoded, 'type'>
  & Pick<BreadcrumbNavigationItem, 'icon'>
  & { status: 'success' | 'error' | 'request'; }
;

export type BreadcrumbHistoryRequestItemFunction = (match: RouteMatch<string, RouteObject>) => Promise<
  Optional<BreadcrumbNavigationHistoryItem, 'path'>
>;

export type BreadcrumbNavigationMapping = Record<string, BreadcrumbNavigationItem>;

export type BreadcrumbActiveNavigationItemChild = Pick<BreadcrumbNavigationItem, 'current' | 'icon' | 'label' | 'name' | 'path'>
export type BreadcrumbActiveNavigationItem = BreadcrumbActiveNavigationItemChild & {
  children: BreadcrumbActiveNavigationItemChild[];
};

export type TaskViewConfigName = "proposed" | "quick" | "important" | "abstained" | "awaiting";

export type BreadcrumbActiveNavigation = {
  breadcrumbs: BreadcrumbActiveNavigationItem[];
  current: BreadcrumbActiveNavigationItem | undefined;
};
