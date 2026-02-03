import { useTheme } from "@gergling/ui-components";
import { PropsWithChildren, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NavigationBreadcrumbs } from "../shared/navigation";
import { DevModeOverlay } from "../app/DevModeDrawer";
import { ErrorBoundary } from "../shared/common/components/ErrorBoundary";

const useApp = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme({ mode: 'dark', project: 'gds' });
  }, [setTheme]);
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
    </ErrorBoundary>
  );
};

export default RootView;
