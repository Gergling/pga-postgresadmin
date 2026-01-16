import settings from 'electron-settings';
import { EnvironmentProps, ManageEnvironment } from "./types";
import { ENVIRONMENT_SETTINGS_KEY, ENVIRONMENTS } from './constants';

export const manageEnvironment = (): ManageEnvironment => ({
  get: async () => {
    const envValue = await settings.get(ENVIRONMENT_SETTINGS_KEY) as string | null;
    if (envValue && (ENVIRONMENTS as string[]).includes(envValue)) return envValue as EnvironmentProps;
    return 'dev';
  },
  set: async (env: EnvironmentProps) => {
    try {
      await settings.set(ENVIRONMENT_SETTINGS_KEY, env);
      console.log(`Environment set to ${env}`)
      return {
        success: true,
        data: env
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },
});
