import { createContext } from "react";
import { IPC_EXPOSURE_PROPERTY_NAME } from "../../../ipc/constants";
import { IpcInvocationConfig } from "../../../ipc/config";

declare global {
  interface Window {
    [IPC_EXPOSURE_PROPERTY_NAME]: IpcInvocationConfig;
  }
}

export const IpcContext = createContext<Window>(window);
