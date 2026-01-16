import { ipcMain } from "electron";
import { IpcAdditionalParameters, ipcHandlerConfig } from "../../ipc/config";
import { handleIpc } from "../../libs/ipc";

export const setupHandlers = (params: IpcAdditionalParameters) => {
  handleIpc(ipcHandlerConfig, ipcMain, params);
} 
