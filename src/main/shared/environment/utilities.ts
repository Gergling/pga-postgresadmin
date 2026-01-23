import settings from 'electron-settings';
import { app } from 'electron';
import { ENVIRONMENT_SETTINGS_KEY, ENVIRONMENTS } from './constants';
import { EnvironmentProps, GetEnvironment, SetEnvironment } from './types';
import { log } from '../logging';

export const getEnvironment: GetEnvironment = () => {
  const envValue = settings.getSync(ENVIRONMENT_SETTINGS_KEY) as string | null;
  if (envValue && (ENVIRONMENTS as string[]).includes(envValue)) return envValue as EnvironmentProps;
  return 'dev';
};

export const setEnvironment: SetEnvironment = async (env) => {
  try {
    await settings.set(ENVIRONMENT_SETTINGS_KEY, env);
    log(`Environment set to ${env}.`, 'success');
    log(`Reloading...`, 'info');
    app.relaunch();
    // app.exit(0);
    return {
      success: true,
      data: env
    };
  } catch (error) {
    log(`Error setting environment.`, 'error');
    console.error(error);
    return {
      success: false,
      error: error.message
    };
  }
};
