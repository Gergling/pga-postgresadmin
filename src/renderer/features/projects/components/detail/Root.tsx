import { useEffect, useMemo } from "react";
import {
  NavigationTabs,
  useNavigationRegister
} from "@/renderer/shared/navigation";
import { getProjectHistoryItem } from "../../utilities";
import { ProjectHeading } from "../Heading";
import { PROJECTS_CHILD_TABS } from "../../constants";
import { sigilFactory } from "../../../svg-viewer/components/Sigiliser";
import { Outlet } from "react-router-dom";
import { useProjectDetail } from "../../context";

const getTabs = () => PROJECTS_CHILD_TABS.map(({ label, path, icon }, value) => ({
  icon: icon || sigilFactory(label?.slice(0, 6) || 'Workflower'),
  label: label || '',
  path: path || '',
  selected: false,
  value,
}));

export const ProjectDetail = () => {
  const { project } = useProjectDetail();
  const tabs = useMemo(() => getTabs(), []);
  const { register } = useNavigationRegister();

  useEffect(() => {
    register(getProjectHistoryItem(project));
  }, [project]);

  return <>
    <ProjectHeading {...project} />
    <NavigationTabs tabs={tabs} />
    <Outlet />
  </>;
};
