import { Project } from "@/shared/features/projects";
import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "@/renderer/features/svg-viewer/components";

export const PROJECTS_BASE_ROUTE = 'projects';
export const PROJECTS_BASE_ROUTE_ABSOLUTE = `/${PROJECTS_BASE_ROUTE}`;

const tabs = [
  { icon: runeFactory('Project Overview'), label: 'Overview', path: '' },
  { label: 'Chat', path: 'chat' },
  {
    label: 'CLI', path: 'cli',
    // If no local presence, disable the tab.
    // TODO: Provide a hover "i" icon to display the "why" it's disabled.
    disable: () => '',
  },
  { label: 'Notes', path: 'notes' },
] as const;

export type ProjectTabPath = typeof tabs[number]['path'];

export const PROJECTS_CHILD_TABS: (UiNavigationConfigItem<ProjectTabPath> & {
  disable?: (project: Project) => string;
})[] = tabs.map(({ label, ...props }) => ({
  ...props,
  icon: ('icon' in props && props.icon) || runeFactory(label),
  label,
  omitBreadcrumb: true,
}));
