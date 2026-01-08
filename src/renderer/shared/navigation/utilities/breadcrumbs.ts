import {
  BreadcrumbActiveNavigation,
  BreadcrumbActiveNavigationItem,
  BreadcrumbNavigationItem,
  BreadcrumbNavigationMapping,
  UiNavigationItem
} from "../types";

const getPath = (
  baseUrl: string,
  pathSegment?: string
) => {
  if (pathSegment === undefined) return getPath(baseUrl, '');
  if (!baseUrl && pathSegment === '/') return '/';
  if (baseUrl === '/') {
    if (pathSegment === '') return '/';

    return `/${pathSegment}`;
  }

  return [baseUrl, pathSegment].join('/');
}

export const reduceFlatBreadcrumbMappingFactory = (
  baseUrl = ''
) => (
  mapping: BreadcrumbNavigationMapping,
  { icon, label, path: pathSegment, children: childItems, omitBreadcrumb }: UiNavigationItem
): BreadcrumbNavigationMapping => {
  // If the breadcrumb is explicitly omitted, we don't want it.
  if (omitBreadcrumb) return mapping;

  const path = getPath(baseUrl, pathSegment);

  if (!icon || !label || !path) throw new Error(
    `Somehow the icon or label is missing for path "${path}". This should never happen.`
  );

  const reduceFlatBreadcrumbMapping = reduceFlatBreadcrumbMappingFactory(path);
  const mappedChildren = childItems ? childItems.reduce(reduceFlatBreadcrumbMapping, {}) : {};
  const children = childItems?.reduce((children, item) => {
    const childPath = getPath(path, item.path);
    const childItem = mappedChildren[childPath];

    if (!childItem) return children;

    return [
      ...children,
      childPath,
    ];
  }, []) ?? [];
  const breadcrumbItem: BreadcrumbNavigationItem = {
    active: false,
    children,
    current: false,
    icon,
    label,
    name: pathSegment ?? '',
    path,
  };

  return {
    ...mapping,
    [path]: breadcrumbItem,
    ...mappedChildren,
  };
};

export const reduceActiveNavigationFactory = (
  pathname: string,
  breadcrumbsMap: BreadcrumbNavigationMapping
) => (
  acc: BreadcrumbActiveNavigation,
  { item, path }: { item: BreadcrumbNavigationItem, path: string }
): BreadcrumbActiveNavigation => {
  const active = pathname.startsWith(path);
  const current = path === pathname;

  if (!active) return acc;

  const children = item.children.map((childPath) => breadcrumbsMap[childPath]);
  const node: BreadcrumbActiveNavigationItem = {
    ...item,
    children,
    current,
  };

  return {
    ...acc,
    breadcrumbs: [
      ...acc.breadcrumbs,
      node,
    ],
    current: current ? node : acc.current,
  };
};
