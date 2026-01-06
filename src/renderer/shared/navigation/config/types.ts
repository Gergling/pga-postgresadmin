import { TabProps } from "@mui/material";
import { Swap } from "../../../../shared/types";
import { ReactNode } from "react";
import { LoaderFunction, RouteObject } from "react-router-dom";

export type UiRouteConfigTemplateItem = {
  element: () => ReactNode;
  icon?: React.ComponentType;
  index?: boolean;
  label?: string;
  children?: RouteObject[];
  loader?: LoaderFunction;
  path?: string;
};

export type UiRouteConfigItem<T extends string> = UiRouteConfigTemplateItem & { name: T; };
type Template<T extends string> = Record<T, UiRouteConfigItem<T>>;

export type UiRouteConfigBreakdown<T extends string> = {
  config: Template<T>;
  index: Swap<UiRouteConfigItem<T>, 'index', true>;
  routes: RouteObject[];
  tabs: TabProps[];
};
