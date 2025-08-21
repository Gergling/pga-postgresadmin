import { createContext } from "react";
import { IPC_EXPOSURE_PROPERTY_NAME } from "../../../ipc/constants";
import { IpcInvocationConfig } from "../../../ipc/config";
import { EventSubscriptionHandlerMapping } from "../../../libs/ipc";

declare global {
  interface Window {
    [IPC_EXPOSURE_PROPERTY_NAME]: IpcInvocationConfig & EventSubscriptionHandlerMapping;
  }
}

export const IpcContext = createContext<Window>(window);
