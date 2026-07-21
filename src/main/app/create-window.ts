import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { createIPCHandler } from 'trpc-electron/main';
import { EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED } from '@/ipc';
import { registerVessel } from '@/main/shared/vessel';
import { setupRitualTelemetryHandler } from '@/main/features/ai';
import { router } from './router';
import { isFirebaseDevEnabled } from '@/main/libs/firebase';

export const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Defaults to false.
      preload: path.join(import.meta.dirname, '../preload/preload.mjs'),
    },
  });

  // Load the index.html of the app.
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(path.join(import.meta.dirname, `../renderer/index.html`));
  }

  // Open the DevTools.
  if (isFirebaseDevEnabled) mainWindow.webContents.openDevTools();

  mainWindow.maximize();

  mainWindow.on('focus', () => {
    mainWindow.webContents.send(EVENT_SUBSCRIPTION_WINDOW_EVENT_FOCUSED);
  });

  setupRitualTelemetryHandler(ipcMain);

  registerVessel(mainWindow);

  createIPCHandler({ router, windows: [mainWindow] });
};
