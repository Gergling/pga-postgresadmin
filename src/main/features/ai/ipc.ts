import { Optional } from "../../../shared/types";
import { CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY } from "../../../shared/channels";
import { RitualTelemetrySubscriptionParams } from "../../../shared/features/ai";
import { getVessel } from "@/main/shared/vessel";
import { rpcLog, tRPC } from "@/main/config";
import {
  listLlmOperations,
  listLlmSummaries,
} from "@/main/shared/llm";

/**
 * @deprecated Use tRPC.procedure.subscription instead.
 * @param ipcMain 
 */
export const setupRitualTelemetryHandler = (ipcMain: Electron.IpcMain) => {
  // Use .handle because the renderer is using .invoke
  ipcMain.handle(CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY, (
    // event,
  ) => {
    // console.log("Renderer has requested Ritual Telemetry subscription.");

    return { status: 'success' };
  });
};

/**
 * @deprecated Use tRPC.procedure.subscription instead.
 * @param ipcRenderer 
 * @param listener 
 * @returns 
 */
export const setupRitualTelemetrySubscription = (
  ipcRenderer: Electron.IpcRenderer,
  listener: (update: RitualTelemetrySubscriptionParams) => void
) => {
  const subscription = (
    event: Electron.IpcRendererEvent,
    update: RitualTelemetrySubscriptionParams
  ) => {
    listener(update);
  }
  ipcRenderer.on(CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY, subscription);
  ipcRenderer.invoke(CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY);
  ipcRenderer.send(CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY);

  return () => ipcRenderer.removeListener(CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY, subscription);
};

export const aiRouter = tRPC.router({
  readOperationSummaries: tRPC.procedure.query(rpcLog(({
    logApi
  }) => listLlmOperations(logApi))),
  readAvailableModels: tRPC.procedure.query(rpcLog(({
    logApi
  }) => listLlmSummaries(logApi))),
});
