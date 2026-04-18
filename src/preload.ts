import { contextBridge, ipcRenderer } from "electron";
import { exposeElectronTRPC } from 'trpc-electron/main';
import { preloadIpc } from "./libs/ipc";
import { IPC_EXPOSURE_PROPERTY_NAME, ipcHandlerConfig } from "./ipc";

preloadIpc(IPC_EXPOSURE_PROPERTY_NAME, ipcHandlerConfig, contextBridge, ipcRenderer);

process.once('loaded', async () => {
  console.info('Process loaded.');
  exposeElectronTRPC();
});
