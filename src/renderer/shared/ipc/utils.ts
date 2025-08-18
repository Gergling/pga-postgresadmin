import { createContext, useContext } from "react";
import { IpcInvocationConfig } from "../../../ipc/config";
import { IPC_EXPOSURE_PROPERTY_NAME } from "../../../ipc/constants";

declare global {
  interface Window {
    [IPC_EXPOSURE_PROPERTY_NAME]: IpcInvocationConfig;
  }
}

export const IpcContext = createContext(window);

export const useIpc = () => {
  const context = useContext(IpcContext);
  const ipc = context[IPC_EXPOSURE_PROPERTY_NAME];
  return ipc;
};

