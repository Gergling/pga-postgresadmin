import { Outlet } from "react-router-dom";
import { NavigationTabs } from "@/renderer/shared/navigation";
import { ErrorBoundary } from "@/renderer/shared/common";
import { sigilFactory } from "../../svg-viewer/components/Sigiliser";
import { AI_CHILD_ROUTES } from "./constants";

const tabs = AI_CHILD_ROUTES.map(({ label, path, icon }, value) => ({
  icon: icon || sigilFactory(label?.slice(0, 6) || 'Workflower'),
  label: label || '',
  path: path || '',
  selected: false,
  value,
}));

export const AiRoot = () => {
  return <>
    <NavigationTabs tabs={tabs} />
    <ErrorBoundary fallback={<>AI did a bad.</>}>
      <div style={{ padding: '0 2rem' }}>
        <Outlet />
      </div>
    </ErrorBoundary>
  </>
};
