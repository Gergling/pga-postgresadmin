import task from 'tasuku';
import {
  EnvironmentPropsSchema,
  loadElectronSettings,
  getVessel,
  saveElectronSettings,
} from '@/main/shared';
import { initializeFirebase } from "@/main/libs/firebase";
import { tRPC } from '@main/config';

export const environmentRouter = tRPC.router({
  get: tRPC.procedure.query(async () => {
    const value = await loadElectronSettings('env');
    return EnvironmentPropsSchema.parse(value);
  }),
  set: tRPC.procedure.input(EnvironmentPropsSchema).mutation(
    async ({ input: env }) => {
      await task(
        `Switching to ${env} environment`,
        async ({ task }) => {
          await task(
            `Setting`,
            () => saveElectronSettings('env', env)
          );
          await task(
            `Initialising Firebase`,
            ({ task }) => initializeFirebase(task)
          );
        }
      )
      getVessel()?.reload();
      return {
        success: true,
        data: env
      };
    }
  ),
});
