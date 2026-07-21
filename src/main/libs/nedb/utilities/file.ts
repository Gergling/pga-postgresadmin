import { app } from "electron";
import { log } from "@/main/shared";

const appDataPath = app.getPath('userData');

log(`Electron appDataPath: ${appDataPath}`);

export const getNeDbFileName = (collectionName: string) => {
  return `${appDataPath}/Data/${collectionName}.db`;
};
