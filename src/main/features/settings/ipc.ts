import { APPLICATION_SETTINGS_SCHEMA } from '@/shared/features/settings';
import { tRPC } from '@/main/config/trpc';
import { fetchAppSettings, updateAppSettings } from '@/main/shared/settings';

export const settingsRouter = tRPC.router({
  fetchAll: tRPC.procedure.query(() => fetchAppSettings()),
  update: tRPC.procedure.input(APPLICATION_SETTINGS_SCHEMA).mutation(
    ({ input }) => updateAppSettings(input)
  ),
});
