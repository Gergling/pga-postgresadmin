import { createContext } from "react";
import { IPC_EXPOSURE_PROPERTY_NAME } from "../../../ipc/constants";
import { IpcInvocationConfig } from "../../../ipc/config";
import { EventSubscriptionHandlerMapping } from "../../../libs/ipc";
import { ChannelSubscribeToDockerChecklist } from "../../../shared/channels";
import { DockerChecklistSubscriptionParams } from "../../../shared/docker-postgres/types";

declare global {
  interface Window {
    [IPC_EXPOSURE_PROPERTY_NAME]: IpcInvocationConfig & EventSubscriptionHandlerMapping & {
      [K in ChannelSubscribeToDockerChecklist]: (
        listener: (update: DockerChecklistSubscriptionParams) => void
      ) => () => void;
    };
  }
}

export const IpcContext = createContext<Window>(window);
