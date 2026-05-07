// Probably belongs in shared
import { Optional } from "../../../shared/types";
import { CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY } from "../../../shared/channels";
import { RitualTelemetrySubscriptionParams } from "../../../shared/features/ai";
import { getVessel } from "../../shared/vessel";

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

/**
 * @deprecated Use tRPC.procedure.subscription instead.
 * @param payload 
 * @returns 
 */
export const emitRitualTelemetry = (payload: Optional<RitualTelemetrySubscriptionParams, 'timestamp'>) => {
  const timestamp = Date.now()
  const vessel = getVessel();
  
  if (!vessel) {
    console.warn("Ritual Telemetry failed: No vessel registered.");
    return;
  }
  
  // The broadcast
  vessel.webContents.send(CHANNEL_SUBSCRIBE_TO_RITUAL_TELEMETRY, { timestamp, ...payload });
};