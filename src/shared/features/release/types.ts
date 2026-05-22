import { AppUpdaterEvents } from "electron-updater/out/AppUpdater";

export type ReleaseUpdateSubscriptionParameters = {
  status: keyof AppUpdaterEvents | 'idle'; progress?: number; message?: string;
};
