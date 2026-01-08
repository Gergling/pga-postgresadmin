import { useTheme } from "@gergling/ui-components";
import { Skeleton } from "@mui/material";
import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavigationBreadcrumbs } from "../shared/navigation";

const useApp = () => {
  const { pathname } = useLocation();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme({ mode: 'dark', project: 'gds' });
  }, [setTheme]);

  return {
    pathname,
  };
};

const Debug = ({ children }: PropsWithChildren) => {
  const { theme: { colors: { info } } } = useTheme();
  return (
    <div style={{ backgroundColor: info.main, color: info.on, paddingLeft: '5px', }}>
      {children}
    </div>
  );
};

export const HydrateFallback = () => {
  return <Skeleton variant="rectangular" height={100} />
};

export const RootView = () => {
  const {
    pathname,
  } = useApp();

  return (
    <div>
      <Debug>Current path: {pathname}</Debug>
      <NavigationBreadcrumbs />
      <Outlet />
    </div>
  );
};

export default RootView;
