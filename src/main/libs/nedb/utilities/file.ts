import { app } from "electron";

const appDataPath = app.getPath('userData');

console.log('Electron appDataPath:', appDataPath);

export const getNeDbFileName = (collectionName: string) => {
  return `${appDataPath}/Data/${collectionName}.db`;
};
