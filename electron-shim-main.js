import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const electron = require('electron');

export const ipcMain = electron.ipcMain;
export const contextBridge = electron.contextBridge || { exposeInMainWorld: () => {/**/} };
export const ipcRenderer = electron.ipcRenderer || {};
export default electron;

console.log('SHIMMED')
