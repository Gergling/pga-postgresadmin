import { redirect, RouteObject } from "react-router-dom";
import { HomeView } from "../../../views";
import { Home } from "@mui/icons-material";
import { getTaskRouteConfig } from "./tasks";
import { UiRouteConfigBreakdown, UiRouteConfigTemplateItem } from "./types";
import { reduceUiNavigation } from "./utilities";
import { TabProps } from "@mui/material";
import { Swap } from "../../../../shared/types";

const config = {
  home: {
    element: HomeView,
    icon: Home,
    index: true,
    label: 'Home',
    // TODO: I don't think this function is doing anything, but I haven't
    // bothered to check and I want to get on with MVP.
    loader: () => {
      console.log('home loader')
      return redirect('/home');
    },
  },
  tasks: getTaskRouteConfig(),
};

type UiRouteConfigTemplate<T extends Record<string, UiRouteConfigTemplateItem> = typeof config> = T;
export type UiRouteConfig = UiRouteConfigTemplate;
export type UiRouteNames = keyof UiRouteConfig;
export type UiRouteConfigItem = UiRouteConfig[UiRouteNames] & {
  name: UiRouteNames;
  index: boolean;
  path: string;
};

export const getUiNavigation = () => Object.entries(config).reduce<UiRouteConfigBreakdown<UiRouteNames>>(
  (acc, [name, item]) => reduceUiNavigation<UiRouteNames>(acc, { ...item, name: name as UiRouteNames }),
  {
    config: {} as Record<UiRouteNames, UiRouteConfigItem>,
    index: {} as Swap<UiRouteConfigItem, 'index', true>,
    routes: [] as RouteObject[],
    tabs: [] as TabProps[],
  }
);
