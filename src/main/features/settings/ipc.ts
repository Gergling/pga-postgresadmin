import { APPLICATION_SETTINGS_SCHEMA } from '@/shared/features/settings';
import { tRPC } from '@/main/config/trpc';
import {
  fetchAppSettings,
  getElectronSetting,
  updateAppSettings
} from '@/main/shared/settings';

export const settingsRouter = tRPC.router({
  fetchAll: tRPC.procedure.query(() => getElectronSetting()),
  fetchApp: tRPC.procedure.query(() => fetchAppSettings()),
  update: tRPC.procedure.input(APPLICATION_SETTINGS_SCHEMA).mutation(
    ({ input }) => updateAppSettings(input)
  ),
});
