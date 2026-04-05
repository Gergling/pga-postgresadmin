// TODO: Move to app level, along with overall navigation routing.
import { useTheme } from "@gergling/ui-components";
import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavigationBreadcrumbs } from "../shared/navigation";
import { DevModeOverlay } from "../app/DevModeDrawer";
import { ErrorBoundary } from "../shared/common/components/ErrorBoundary";
import { DiaryDrawer, useDiary } from "../features/diary";
import { useTaskNavigation } from "../features/tasks/hooks/navigation";
import { PhraseDuJour } from "../features/banners";
import { useProjectNavigation } from "../features/projects";
import { Box } from "@mui/material";
import { StatusOverview } from "../features/status";
// import type {} from '@mui/x-date-pickers/themeAugmentation';

const useApp = () => {
  const { pathname, search } = useLocation();
  const { setTheme } = useTheme();
  const { drawer: { setIsAvailable: setDiaryQuickEntryAvailability } } = useDiary();

  useEffect(() => {
    setTheme({ mode: 'dark', project: 'gds' });
  }, [setTheme]);

  // TODO: A dependency that triggers a useEffect that doesn't contain the dependency... I don't like it.
  useEffect(() => {
    console.log('enable drawer')
    setDiaryQuickEntryAvailability(true);
  }, [pathname, setDiaryQuickEntryAvailability]);

  useProjectNavigation();
  useTaskNavigation();

  return {
    pathname,
    search,
  };
};

const NavigationFallback = ({ children }: PropsWithChildren) => <>{children} <a style={{ color: 'white' }} href="/">Return Home</a></>;

const STATUS_HEIGHT = 1.1;
const STATUS_PADDING = 0.5;
const MAIN_BOTTOM = STATUS_HEIGHT + (STATUS_PADDING * 2);
const LAYOUT_CONFIG = {
  STATUS_HEIGHT,
  STATUS_PADDING,
  MAIN_BOTTOM,
} as const;
type LayoutConfig = typeof LAYOUT_CONFIG;
const LAYOUT_MEASUREMENTS = Object.entries(LAYOUT_CONFIG).reduce(
  (acc, [key, value]) => ({ ...acc, [key]: `${value}rem` }),
  {} as Record<keyof LayoutConfig, string>
);

export const RootView = () => {
  const { pathname, search } = useApp();

  return (
    <ErrorBoundary fallback={<NavigationFallback>Something bad has happened.</NavigationFallback>}>
      <Box sx={{
        overflow: 'auto',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: LAYOUT_MEASUREMENTS.MAIN_BOTTOM,
      }}>
        <DevModeOverlay />

        <ErrorBoundary fallback={<NavigationFallback>Navigation has failed.</NavigationFallback>}>
          <NavigationBreadcrumbs />
        </ErrorBoundary>

        {/* <HeaderBanner /> */}
        <PhraseDuJour />

        <ErrorBoundary fallback={<NavigationFallback>Something has gone wrong with the Root outlet at {pathname + search}.</NavigationFallback>}>
          <Outlet />
        </ErrorBoundary>

        <ErrorBoundary fallback={<NavigationFallback>Diary drawer has failed.</NavigationFallback>}>
          <DiaryDrawer />
        </ErrorBoundary>
      </Box>
      <Box sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: LAYOUT_MEASUREMENTS.STATUS_HEIGHT,
        padding: LAYOUT_MEASUREMENTS.STATUS_PADDING,
      }}>
        <StatusOverview />
      </Box>
    </ErrorBoundary>
  );
};

export default RootView;
