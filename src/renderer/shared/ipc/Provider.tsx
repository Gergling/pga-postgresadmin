import { PropsWithChildren } from "react";
import { IpcContext } from "./context";

export const IpcContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <IpcContext.Provider value={window}>
      {children}
    </IpcContext.Provider>
  )
};
