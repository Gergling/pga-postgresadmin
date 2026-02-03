import { useEffect, useMemo } from "react";
import { matchRoutes as matchRoutesBase, useLocation } from "react-router-dom";
import { NAVIGATION_TREE } from "../constants";
import { BreadcrumbActiveNavigation } from "../types";
import { reduceActiveNavigationFactory, reduceFlatBreadcrumbMappingFactory, reduceRoutes } from "../utilities";
import { useNavigationHistory } from "./history";
import { useNavigationRegister } from "../context";

const reduceFlatBreadcrumbMapping = reduceFlatBreadcrumbMappingFactory();
const breadcrumbsMap = reduceFlatBreadcrumbMapping({}, NAVIGATION_TREE);
const routes = reduceRoutes([], NAVIGATION_TREE);

const initialActiveNavigation: BreadcrumbActiveNavigation = {
  breadcrumbs: [],
  current: undefined,
};

export const matchRoutes = (path: string) => matchRoutesBase(routes, path);

export const useNavigation = () => {
  const { pathname } = useLocation();
  const {
    breadcrumbs,
    current,
    matchCurrentRoute,
  } = useMemo(
    () => {
      const matchCurrentRoute = matchRoutes(pathname);
      const reduceMap = reduceActiveNavigationFactory(pathname, breadcrumbsMap);
      const activeNavigation = Object.entries(breadcrumbsMap).reduce(
        (acc, [path, item]) => reduceMap(acc, { item, path }),
        initialActiveNavigation
      );
      return {
        ...activeNavigation,
        matchCurrentRoute,
      };
    },
    [pathname]
  );
  const { register } = useNavigationRegister();
  const frequency = useNavigationHistory();
  const recent = useMemo(
    () => frequency
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label))
    ,
    [frequency]
  );

  useEffect(() => {
    Object.values(breadcrumbsMap).forEach((item) => {
      // TODO: Filter out parametric route nodes.
      register(item);
    });
  }, [register]);

  return {
    breadcrumbs,
    current,
    matchCurrentRoute,
    pathname,
    recent,
    routes,
  };
};
