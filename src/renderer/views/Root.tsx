import { useTheme } from "@gergling/ui-components";
import { PropsWithChildren, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NavigationBreadcrumbs } from "../shared/navigation";
import { DevModeOverlay } from "../app/DevModeDrawer";
import { ErrorBoundary } from "../shared/common/components/ErrorBoundary";
import { DiaryDrawer } from "../features/diary";
import { useTaskNavigation } from "../features/tasks/hooks/navigation";

const useApp = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme({ mode: 'dark', project: 'gds' });
  }, [setTheme]);

  useTaskNavigation();
};

const NavigationFallback = ({ children }: PropsWithChildren) => <>{children} <a style={{ color: 'white' }} href="/">Return Home</a></>;

export const RootView = () => {
  useApp();

  return (
    <ErrorBoundary fallback={<NavigationFallback>Something bad has happened.</NavigationFallback>}>
      <DevModeOverlay />

      <ErrorBoundary fallback={<NavigationFallback>Navigation has failed.</NavigationFallback>}>
        <NavigationBreadcrumbs />
      </ErrorBoundary>

      <Outlet />

      <ErrorBoundary fallback={<NavigationFallback>Diary drawer has failed.</NavigationFallback>}>
        <DiaryDrawer />
      </ErrorBoundary>
    </ErrorBoundary>
  );
};

export default RootView;
