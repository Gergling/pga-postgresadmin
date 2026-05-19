import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../svg-viewer/components";
import { EXPLORER_BASE_ROUTE } from "./constants";
import { ExplorerRoot } from "./components";

export const EXPLORER_ROUTES: UiNavigationConfigItem = {
  icon: runeFactory('Explorer'),
  label: 'Explorer',
  path: EXPLORER_BASE_ROUTE,
  element: ExplorerRoot,
};
