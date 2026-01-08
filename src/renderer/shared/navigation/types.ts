import { LoaderFunction } from "react-router-dom";

// Navigation config base
export type UiNavigationConfigItem<T extends string = string> = {
  element?: React.ComponentType;
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
  icon?: undefined;
  label?: undefined;
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
