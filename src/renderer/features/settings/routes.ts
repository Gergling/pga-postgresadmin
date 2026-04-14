import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../svg-viewer/components";
import { SETTINGS_BASE_ROUTE } from "./constants";
import { SettingsRoot } from "./components";

export const SETTINGS_ROUTES: UiNavigationConfigItem = {
  icon: runeFactory('Settings'),
  label: 'Setting',
  path: SETTINGS_BASE_ROUTE,
  element: SettingsRoot,
};
