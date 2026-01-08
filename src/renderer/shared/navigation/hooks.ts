import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { NAVIGATION_TREE } from "./constants";
import { BreadcrumbActiveNavigation } from "./types";
import { reduceActiveNavigationFactory, reduceFlatBreadcrumbMappingFactory, reduceRoutes } from "./utilities";

const reduceFlatBreadcrumbMapping = reduceFlatBreadcrumbMappingFactory();
const breadcrumbsMap = reduceFlatBreadcrumbMapping({}, NAVIGATION_TREE);
const routes = reduceRoutes([], NAVIGATION_TREE);

const initialActiveNavigation: BreadcrumbActiveNavigation = {
  breadcrumbs: [],
  current: undefined,
};

export const useNavigation = () => {
  const { pathname } = useLocation();
  const {
    breadcrumbs,
    current,
  } = useMemo(
    () => {
      const reduceMap = reduceActiveNavigationFactory(pathname, breadcrumbsMap);
      return Object.entries(breadcrumbsMap).reduce(
        (acc, [path, item]) => reduceMap(acc, { item, path }),
        initialActiveNavigation
      );
    },
    [pathname]
  );

  return {
    breadcrumbs,
    current,
    routes,
  };
};
