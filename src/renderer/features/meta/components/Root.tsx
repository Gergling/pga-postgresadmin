import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { NavigationTabs } from "@/renderer/shared/navigation";
import {
  sigilFactory
} from "@/renderer/features/svg-viewer/components/Sigiliser";
import { ErrorBoundary } from "@/renderer/shared/common";
import { META_CHILD_ROUTES } from "../constants";

const getTabs = () => META_CHILD_ROUTES.map(({ label, path, icon }, value) => ({
  icon: icon || sigilFactory(label?.slice(0, 6) || 'Workflower'),
  label: label || '',
  path: path || '',
  selected: false,
  value,
}));

export const MetaRoot = () => {
  const tabs = useMemo(() => getTabs(), []);
  return <>
    <NavigationTabs tabs={tabs} />
    <ErrorBoundary fallback={<>Meta did a bad.</>}>
      <div style={{ padding: '0 2rem' }}>
        <Outlet />
      </div>
    </ErrorBoundary>
  </>;
};
