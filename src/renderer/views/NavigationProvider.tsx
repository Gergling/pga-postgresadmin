import { RouterProvider } from "react-router-dom";
import { NavigationRegisterProvider } from "../shared/navigation/context";
import { NAVIGATION_ROUTER } from "./routes";

export const NavigationProvider = () => {
  return (
    <NavigationRegisterProvider>
      <RouterProvider
        router={NAVIGATION_ROUTER}
      />
    </NavigationRegisterProvider>
  );
};
