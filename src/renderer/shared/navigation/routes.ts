// TODO: Can be moved into a single file with the other routes.ts file.
import { createHashRouter } from "react-router-dom";
import { NAVIGATION_TREE } from "../../views/routes";
import { reduceRoutes } from "./utilities";

const routes = reduceRoutes([], NAVIGATION_TREE);
/**
 * @deprecated Use the one at /views instead.
 */
export const NAVIGATION_ROUTER = createHashRouter(routes);
