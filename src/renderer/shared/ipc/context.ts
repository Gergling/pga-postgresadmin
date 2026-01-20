import { createContext } from "react";
import { IPC_EXPOSURE_PROPERTY_NAME } from "../../../ipc/constants";
import { IpcInvocationConfig } from "../../../ipc/config";
import { EventSubscriptionHandlerMapping } from "../../../libs/ipc";
import { ChannelSubscribeToDockerChecklist, ChannelSubscribeToRitualTelemetry } from "../../../shared/channels";
import { DockerChecklistSubscriptionParams } from "../../../shared/docker-postgres/types";
import { RitualTelemetrySubscriptionParams } from "../../../shared/features/ai";

declare global {
  interface Window {
    [IPC_EXPOSURE_PROPERTY_NAME]: IpcInvocationConfig & EventSubscriptionHandlerMapping & {
      [K in ChannelSubscribeToDockerChecklist]: (
        listener: (update: DockerChecklistSubscriptionParams) => void
      ) => () => void;
    } & {
      [K in ChannelSubscribeToRitualTelemetry]: (
        listener: (update: RitualTelemetrySubscriptionParams) => void
      ) => () => void;
    };
  }
}

export const IpcContext = createContext<Window>(window);
