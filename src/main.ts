import { app } from 'electron';
import squirrelStartup from 'electron-squirrel-startup';
import { setupElectronEventHandlers } from '@/main/app';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (squirrelStartup) {
  app.quit();
  process.exit(0);
}

setupElectronEventHandlers(app);

/**
 * Path Type 	Code Snippet	Use Case
Root App Path	app.getAppPath()	The root folder containing your package.json.
User Data	app.getPath('userData')	Storing settings, databases, or logs.
Executable Path	app.getPath('exe')	The directory where the actual .exe or binary lives.
 */