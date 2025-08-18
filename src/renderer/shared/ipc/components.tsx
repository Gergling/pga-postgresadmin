import { PropsWithChildren } from "react";
import { IpcContext } from "./utils";

export const IpcContextProvider = ({ children }: PropsWithChildren) => {
  return (
    <IpcContext.Provider value={window}>
      {children}
    </IpcContext.Provider>
  )
};
