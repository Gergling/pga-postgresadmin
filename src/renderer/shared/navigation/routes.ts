import { createHashRouter } from "react-router-dom";
import { NAVIGATION_TREE } from "./constants";
import { reduceRoutes } from "./utilities";

const routes = reduceRoutes([], NAVIGATION_TREE);
export const NAVIGATION_ROUTER = createHashRouter(routes);
