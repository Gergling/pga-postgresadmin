import task from 'tasuku';
import {
  EnvironmentPropsSchema,
  getElectronSetting,
  getVessel,
  setElectronSetting,
} from '@/main/shared';
import { initializeFirebase } from "@/main/libs/firebase";
import { tRPC } from '@main/config';

export const environmentRouter = tRPC.router({
  get: tRPC.procedure.query(async () => {
    const value = await getElectronSetting('env');
    return EnvironmentPropsSchema.parse(value);
  }),
  set: tRPC.procedure.input(EnvironmentPropsSchema).mutation(
    async ({ input: env }) => {
      await task(
        `Setting up ${env} environment`, () => setElectronSetting('env', env)
      );
      await task(`Initialising Firebase`, initializeFirebase);
      getVessel()?.reload();
      return {
        success: true,
        data: env
      };
    }
  ),
});
