import { BrowserWindow, ipcMain } from "electron";
import { log } from "@/main/shared/logging";
import { createWindow } from "./create-window";

export const setupElectronEventHandlers = (app: Electron.App) => app
  .on('ready', () => {
    createWindow();
  })
  .on('window-all-closed', () => {
    log('All windows closed. Quitting app.');
    ipcMain.removeAllListeners();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  })
  .on('activate', () => {
    log('App activated.');
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
;
