import { useTheme } from "@gergling/ui-components";
import { useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import { useStoredView } from "../shared/common/hooks/routes";
import { getUiNavigation, UiRouteNames } from "../shared/navigation/config/root";

export const useApp = () => {
  const { index, routes, tabs } = getUiNavigation();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const defaultView = useMemo(() => index.name, [index]);
  const {
    setStoredView,
    storedView,
  } = useStoredView<UiRouteNames>('root', defaultView);
  const rootPathname = useMemo(() => {
    const root = pathname.split('/')[1];
    console.log('pathname', pathname, root, storedView, root || storedView);
    return (root || storedView) as UiRouteNames;
  }, [pathname]);
  const setSelectedRoute = useCallback((selectedRoute: UiRouteNames) => {
    navigate(selectedRoute);
    setStoredView(selectedRoute);
  }, [navigate, setStoredView]);

  // I should address the order of operations here, hoisting for architectural
  // reasons and how that affects the output of children from useRoutes.
  // Currently they're in this order because I haven't bothered to check what happens if they're not.
  useEffect(() => {
    setSelectedRoute(rootPathname);
  }, [rootPathname, setSelectedRoute]);

  const children = useRoutes(routes);

  useEffect(() => {
    setTheme({ mode: 'dark', project: 'gds' });
  }, [setTheme]);

  return {
    children,
    pathname,
    rootPathname,
    setSelectedRoute,
    tabs,
  };
};
