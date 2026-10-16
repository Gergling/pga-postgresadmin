import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useNavigationRegister } from "../context";
import { BreadcrumbActiveNavigation } from "../types";
import { useNavigationHistory } from "./history";
import { reduceActiveNavigationFactory } from "../utilities";

const initialActiveNavigation: BreadcrumbActiveNavigation = {
  breadcrumbs: [],
  current: undefined,
};

export const useNavigation = () => {
  const { pathname } = useLocation();
  const { breadcrumbsMap, matchRoutes } = useNavigationRegister();
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
    Object.values(breadcrumbsMap).forEach(register);
  }, [breadcrumbsMap, register]);

  return {
    breadcrumbs,
    current,
    matchCurrentRoute,
    pathname,
    recent,
  };
};
