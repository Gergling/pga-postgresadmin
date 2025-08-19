import { PropsWithChildren } from "react";
import { IpcContextProvider } from "../shared/ipc/Provider";

export const AppContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <IpcContextProvider>{children}</IpcContextProvider>
  );
};
