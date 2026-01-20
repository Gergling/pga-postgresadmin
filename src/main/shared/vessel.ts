// main/vessel.ts
import { BrowserWindow } from 'electron';

let mainWindow: BrowserWindow | null = null;

/**
 * Binds the physical window to the registry.
 * Call this in your main entry point after window creation.
 */
export const registerVessel = (window: BrowserWindow) => {
  mainWindow = window;
};

/**
 * Retrieves the bound window for broadcasting rituals.
 */
export const getVessel = () => mainWindow;
