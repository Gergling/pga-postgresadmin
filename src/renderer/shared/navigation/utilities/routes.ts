import { RouteObject } from "react-router-dom";
import { UiNavigationItem } from "../types";
import { createElement } from "react";

const getRoute = (
  item: UiNavigationItem
): RouteObject => {
  const element = item.element ? createElement(item.element) : undefined;
  const base = {
    ...item,
    element,
  };

  if (item.index) return {
    ...base,
    children: undefined,
    index: true,
  };

  const children = item.children ? item.children.reduce(reduceRoutes, []) : undefined;

  return {
    ...base,
    children,
    index: false,
  };
};

export const reduceRoutes = (
  routes: RouteObject[],
  { element, ...item }: UiNavigationItem
): RouteObject[] => {
  const route = getRoute({ element, ...item });

  return [
    ...routes,
    route,
  ];
};
