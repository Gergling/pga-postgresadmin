import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { Home } from "../svg-viewer/components";
import { HOME_BASE_ROUTE } from "./constants";
import { HomeRoot } from "./components";
import {
  getNavigationIcon
} from "@/renderer/shared/navigation/components/getNavigationIcon";

export const HOME_ROUTES: UiNavigationConfigItem = {
  icon: getNavigationIcon(Home),
  label: 'Home',
  path: HOME_BASE_ROUTE,
  element: HomeRoot,
};
