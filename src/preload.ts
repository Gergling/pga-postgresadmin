import { contextBridge, ipcRenderer } from "electron";
import { IPC_EXPOSURE_PROPERTY_NAME, ipcHandlerConfig } from "./ipc";
import { preloadIpc } from "./libs/ipc";

preloadIpc(IPC_EXPOSURE_PROPERTY_NAME, ipcHandlerConfig, contextBridge, ipcRenderer);
