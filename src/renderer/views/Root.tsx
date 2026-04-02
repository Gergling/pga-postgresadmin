import { useTheme } from "@gergling/ui-components";
import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavigationBreadcrumbs } from "../shared/navigation";
import { DevModeOverlay } from "../app/DevModeDrawer";
import { ErrorBoundary } from "../shared/common/components/ErrorBoundary";
import { DiaryDrawer, useDiary } from "../features/diary";
import { useTaskNavigation } from "../features/tasks/hooks/navigation";
import { PhraseDuJour } from "../features/banners";
import { HeaderBanner } from "../features/banners/components/Header";
import { useProjectNavigation } from "../features/projects";
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

export const RootView = () => {
  const { pathname, search } = useApp();

  return (
    <ErrorBoundary fallback={<NavigationFallback>Something bad has happened.</NavigationFallback>}>
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
    </ErrorBoundary>
  );
};

export default RootView;
