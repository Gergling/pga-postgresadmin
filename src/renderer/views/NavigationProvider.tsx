import { RouterProvider } from "react-router-dom";
import { NavigationRegisterProvider } from "../shared/navigation/context";
import { NAVIGATION_ROUTER, NAVIGATION_TREE } from "./routes";

export const NavigationProvider = () => {
  return (
    <NavigationRegisterProvider tree={NAVIGATION_TREE}>
      <RouterProvider
        router={NAVIGATION_ROUTER}
      />
    </NavigationRegisterProvider>
  );
};
