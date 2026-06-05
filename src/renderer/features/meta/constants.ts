import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "@/renderer/features/svg-viewer/components";
import { SettingsRoot } from "../settings";
import { AdminRoot } from "../admin";

export const META_BASE_ROUTE = 'meta';
export const META_BASE_ROUTE_ABSOLUTE = `/${META_BASE_ROUTE}`;

export const META_CHILD_ROUTES: UiNavigationConfigItem[] = [
  {
    label: 'Overview',
    path: '',
    icon: runeFactory('Meta Overview'),
    element: AdminRoot,
  },
  {
    label: 'Settings',
    path: 'settings',
    icon: runeFactory('Settings'),
    element: SettingsRoot,
  }
];
