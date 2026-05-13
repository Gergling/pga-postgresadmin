import { APPLICATION_SETTINGS_SCHEMA } from '@/shared/features/settings';
import { tRPC } from '@/main/config/trpc';
import {
  loadAppSettings,
  loadElectronSettings,
  saveAppSettings
} from '@/main/shared/settings';

export const settingsRouter = tRPC.router({
  fetchAll: tRPC.procedure.query(() => loadElectronSettings()),
  fetchApp: tRPC.procedure.query(() => loadAppSettings()),
  update: tRPC.procedure.input(APPLICATION_SETTINGS_SCHEMA).mutation(
    ({ input }) => saveAppSettings(input)
  ),
});
