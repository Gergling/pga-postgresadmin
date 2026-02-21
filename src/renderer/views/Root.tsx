import { useTheme } from "@gergling/ui-components";
import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavigationBreadcrumbs } from "../shared/navigation";
import { DevModeOverlay } from "../app/DevModeDrawer";
import { ErrorBoundary } from "../shared/common/components/ErrorBoundary";
import { DiaryDrawer } from "../features/diary";
import { useTaskNavigation } from "../features/tasks/hooks/navigation";

const useApp = () => {
  const { pathname } = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme({ mode: 'dark', project: 'gds' });
  }, [setTheme]);

  useTaskNavigation();

  return {
    pathname,
  };
};

const NavigationFallback = ({ children }: PropsWithChildren) => <>{children} <a style={{ color: 'white' }} href="/">Return Home</a></>;

export const RootView = () => {
  const { pathname } = useApp();

  return (
    <ErrorBoundary fallback={<NavigationFallback>Something bad has happened.</NavigationFallback>}>
      <DevModeOverlay />

      <ErrorBoundary fallback={<NavigationFallback>Navigation has failed.</NavigationFallback>}>
        <NavigationBreadcrumbs />
      </ErrorBoundary>

      <ErrorBoundary fallback={<NavigationFallback>Something has gone wrong with the Root outlet at {pathname}.</NavigationFallback>}>
        <Outlet />
      </ErrorBoundary>

      <ErrorBoundary fallback={<NavigationFallback>Diary drawer has failed.</NavigationFallback>}>
        <DiaryDrawer />
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

export default RootView;
