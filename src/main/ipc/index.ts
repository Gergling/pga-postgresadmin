import { ipcMain } from "electron";
import { ipcHandlerConfig } from "../../ipc/config";
import { handleIpc } from "../../libs/ipc";
import { IpcHandlerDatabase } from "../database/types";

export const setupHandlers = (database: IpcHandlerDatabase) => {
  handleIpc(ipcHandlerConfig, ipcMain, { database });
} 
