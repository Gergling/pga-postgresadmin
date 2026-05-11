import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const electron = require('electron');

// Preload needs these for real
export const contextBridge = electron.contextBridge;
export const ipcRenderer = electron.ipcRenderer;

// Preload DOES NOT have ipcMain, so we provide a dummy
export const ipcMain = { on: () => { /**/ }, handle: () => { /**/ } };

export default electron;
