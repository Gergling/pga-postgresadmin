import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "@/renderer/shared/common";
import { NavigationTabs } from "@/renderer/shared/navigation";
import { sigilFactory } from "../../svg-viewer/components/Sigiliser";
import { HOME_CHILD_ROUTES } from "../constants";

const tabs = HOME_CHILD_ROUTES.map(({ label, path, icon }, value) => ({
  icon: icon || sigilFactory(label?.slice(0, 6) || 'Workflower'),
  label: label || '',
  path: path || '',
  selected: false,
  value,
}));

export const HomeRoot = () => {
  return <div>
    <NavigationTabs tabs={tabs} />
    <ErrorBoundary fallback={<>Home did a bad.</>}>
      <div style={{ padding: '0 2rem' }}>
        <Outlet />
      </div>
    </ErrorBoundary>
  </div>
};
