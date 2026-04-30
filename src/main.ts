import { app } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';
import { initialise, setupElectronEventHandlers } from '@/main/app';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
  app.quit();
  process.exit(0);
}

initialise();

setupElectronEventHandlers(app);
