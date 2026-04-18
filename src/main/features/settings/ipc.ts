import { APPLICATION_SETTINGS_SCHEMA } from '@/shared/features/settings';
import { tRPC } from '@/main/config/trpc';
import { fetchSettings, updateSettings } from "./crud";

export const settingsRouter = tRPC.router({
  fetchAll: tRPC.procedure.query(() => fetchSettings()),
  update: tRPC.procedure.input(APPLICATION_SETTINGS_SCHEMA).mutation(
    ({ input }) => updateSettings(input)
  ),
});
