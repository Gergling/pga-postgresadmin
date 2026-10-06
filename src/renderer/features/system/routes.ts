import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { SystemRoot } from "./Root";
import { runeFactory } from "../svg-viewer/components";

export const SYSTEM_ROUTES: UiNavigationConfigItem = {
  element: SystemRoot,
  icon: runeFactory('System'),
  label: 'System',
  path: 'system',
};
