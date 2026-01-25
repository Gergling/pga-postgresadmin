import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { NAVIGATION_TREE } from "../constants";
import { BreadcrumbActiveNavigation } from "../types";
import { reduceActiveNavigationFactory, reduceFlatBreadcrumbMappingFactory, reduceRoutes } from "../utilities";
import { useNavigationHistory } from "./history";

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
  const frequency = useNavigationHistory();
  const recent = useMemo(
    () => frequency
      .map((path) => breadcrumbsMap[path])
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label))
    ,
    [frequency]
  );

  return {
    breadcrumbs,
    current,
    pathname,
    recent,
    routes,
  };
};
