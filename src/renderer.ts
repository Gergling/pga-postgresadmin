/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { createTRPCProxyClient } from '@trpc/client';
import { ipcLink } from 'trpc-electron/renderer';
import './index.css';
import type { AppRouter } from './trpc/router';
import './renderer/app/App';

console.log(`%c Workspace Unifier (WSU) %c Renderer Initialized: ${new Date().toLocaleTimeString()}`, 'color: #00ffff; font-weight: bold;', 'color: default;');

export const client = createTRPCProxyClient<AppRouter>({
  links: [ipcLink()],
  transformer: undefined,
});

