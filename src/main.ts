import { app } from 'electron';
import { initialise, setupElectronEventHandlers } from '@/main/app';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
  process.exit(0);
}

initialise();

setupElectronEventHandlers(app);
