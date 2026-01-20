import { useTheme } from "@gergling/ui-components";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { NavigationBreadcrumbs } from "../shared/navigation";
import { DevModeOverlay } from "../app/DevModeDrawer";

const useApp = () => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme({ mode: 'dark', project: 'gds' });
  }, [setTheme]);
};

export const RootView = () => {
  useApp();

  return (
    <div>
      <DevModeOverlay />
      <NavigationBreadcrumbs />
      <Outlet />
    </div>
  );
};

export default RootView;
