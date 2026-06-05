import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "@/renderer/features/svg-viewer/components";
import { META_BASE_ROUTE, META_CHILD_ROUTES } from "./constants";
import { MetaRoot } from "./components";

export const META_ROUTES: UiNavigationConfigItem = {
  icon: runeFactory('Meta'),
  label: 'Meta',
  path: META_BASE_ROUTE,
  element: MetaRoot,
  children: META_CHILD_ROUTES
};
