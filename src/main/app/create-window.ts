import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { createIPCHandler } from 'trpc-electron/main';
import { EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED } from '@/ipc';
import { registerVessel } from '@/main/shared/vessel';
import { setupRitualTelemetryHandler } from '@/main/features/ai';
import { router } from './router';

export const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.maximize();

  mainWindow.on('focus', () => {
    mainWindow.webContents.send(EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED);
  });

  setupRitualTelemetryHandler(ipcMain);

  registerVessel(mainWindow);

  createIPCHandler({ router, windows: [mainWindow] });
};
