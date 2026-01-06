import { createElement, ReactNode } from "react";
import { IndexRouteObject, NonIndexRouteObject, RouteObject } from "react-router-dom";
import { TabProps } from "@mui/material";
import { Swap } from "../../../../shared/types";
import { UiRouteConfigBreakdown, UiRouteConfigItem } from "./types";

const reduceTabs = <T extends string>(
  tabs: TabProps[],
  { name, ...item }: UiRouteConfigItem<T>
): TabProps[] => {
  if (!('icon' in item) || item.icon === undefined) return tabs;

  const icon = createElement(item.icon);
  return [
    ...tabs,
    {
      icon,
      value: name,
    },
  ];
};

const getIndex = <T extends string>(
  item: UiRouteConfigItem<T>
): Swap<UiRouteConfigItem<T>, 'index', true> => ({
  ...item,
  index: true,
});

const getRouteItem = (
  isIndex: boolean,
  element: ReactNode,
  path: string | undefined,
  children: RouteObject[] | undefined,
): RouteObject => {
  const routeItem: RouteObject = {
    element,
    path,
  };
  if (isIndex) {
    const indexRouteItem: IndexRouteObject = {
      ...routeItem,
      children: undefined,
      index: true,
    };
    return indexRouteItem;
  }

  const nonIndexRouteItem: NonIndexRouteObject = {
    ...routeItem,
    children,
    index: false,
  };

  return nonIndexRouteItem;
};

export const reduceUiNavigation = <T extends string>(
  {
    config,
    routes,
    tabs,
    ...other
  }: UiRouteConfigBreakdown<T>,
  { name, ...item }: UiRouteConfigItem<T>
): UiRouteConfigBreakdown<T> => {
  const element: ReactNode = item.element();
  const isIndex: boolean = 'index' in item ? !!item.index : false;
  const path = 'path' in item ? item.path : `/${name}`;
  const children = 'children' in item ? item.children : undefined;
  const configItem: UiRouteConfigItem<T> = {
    ...item,
    index: isIndex,
    name,
    path: path || '',
  };
  const routeItem: RouteObject = getRouteItem(
    isIndex,
    element,
    path,
    children,
  );
  return {
    config: {
      ...config,
      [name]: configItem,
    },
    index: getIndex(isIndex ? configItem : other.index),
    routes: [
      ...routes,
      routeItem
    ],
    tabs: reduceTabs(tabs, configItem),
  };
};
