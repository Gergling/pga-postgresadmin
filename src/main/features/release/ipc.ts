import { autoUpdater } from 'electron-updater';
import { observable } from '@trpc/server/observable';
import { ReleaseUpdateSubscriptionParameters } from '@/shared/features/release';
import { tRPC } from "@/main/config";

// Disable automatic background downloading if you want users to click "Update Now"
autoUpdater.autoDownload = false;

export const releaseRouter = tRPC.router({
  // Mutation to manually trigger a GitHub release check
  checkForUpdates: tRPC.procedure.mutation(async () => {
    const result = await autoUpdater.checkForUpdates();
    return {
      updateAvailable: result?.updateInfo !== null,
      version: result?.updateInfo.version,
    };
  }),

  // Mutation to start downloading the installer asset
  downloadUpdate: tRPC.procedure.mutation(async () => {
    await autoUpdater.downloadUpdate();
    return { started: true };
  }),

  // Mutation to quit the app and run the installer
  quitAndInstall: tRPC.procedure.mutation(() => {
    autoUpdater.quitAndInstall();
  }),

  // Subscription to stream download progress and status back to React
  onUpdateStatus: tRPC.procedure.subscription(() => {
    return observable<ReleaseUpdateSubscriptionParameters>((emit) => {
      
      autoUpdater.on('checking-for-update', () => emit.next({ status: 'checking-for-update' }));
      autoUpdater.on('update-available', () => emit.next({ status: 'update-available' }));
      autoUpdater.on('update-not-available', () => emit.next({ status: 'update-not-available' }));
      autoUpdater.on('error', (err) => emit.next({
        status: 'error', message: `error: ${err.message}`
      }));
      
      autoUpdater.on('download-progress', (progressObj) => {
        emit.next({ status: 'download-progress', progress: Math.round(progressObj.percent) });
      });
      
      autoUpdater.on('update-downloaded', () => emit.next({ status: 'update-downloaded' }));

      // Clean up event listeners when the component unmounts/unsubscribes
      return () => {
        autoUpdater.removeAllListeners();
      };
    });
  }),
});
