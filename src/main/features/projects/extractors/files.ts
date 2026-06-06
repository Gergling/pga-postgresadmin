import { readdir } from 'fs/promises';
import { loadAppSettings } from "@/main/shared";
import { transformProjectFromPath } from '../utilities';

export const fetchLocalProjectPath = async () => {
  const appSettings = await loadAppSettings();
  return appSettings.projects?.path;
};

export const extractPersonalFolders = async () => {
  const targetPath = await fetchLocalProjectPath();
  if (!targetPath) return;

  try {
    const entries = await readdir(targetPath, { withFileTypes: true });
    const folders = entries
      .filter(entry => entry.isDirectory())
      .map(entry => transformProjectFromPath(targetPath, entry.name));
      
    return folders;
  } catch (error) {
    console.error("Could not read directory:", error);
  }
}
