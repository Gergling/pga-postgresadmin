import { UiNavigationConfigItem } from "@/renderer/shared/navigation";
import { runeFactory } from "../svg-viewer/components";
import { HomeDashboard, HomePanelsList } from "./components";

export const HOME_BASE_ROUTE = 'home';

export const HOME_CHILD_ROUTES: UiNavigationConfigItem[] = [
  {
    label: 'Dashboard',
    path: '',
    icon: runeFactory('Home Dashboard'),
    element: HomeDashboard,
  },
  {
    label: 'Panels',
    path: 'panels',
    icon: runeFactory('Home Panels List'),
    element: HomePanelsList,
  },
];
