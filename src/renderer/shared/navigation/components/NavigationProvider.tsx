import { PropsWithChildren } from "react";
import { RouterProvider } from "react-router-dom";
import { NAVIGATION_ROUTER } from "../routes";

export const NavigationProvider = ({ children }: PropsWithChildren) => (
  <RouterProvider
    fallbackElement={<div style={{ padding: 20 }}>Loading System...</div>}
    router={NAVIGATION_ROUTER}
  >
    {children}
  </RouterProvider>
);
