import settings from 'electron-settings';
import { ENVIRONMENT_SETTINGS_KEY, ENVIRONMENTS } from './constants';
import { EnvironmentProps, GetEnvironment } from './types';

export const getEnvironment: GetEnvironment = () => {
  const envValue = settings.getSync(ENVIRONMENT_SETTINGS_KEY) as string | null;
  if (envValue && (ENVIRONMENTS as string[]).includes(envValue)) return envValue as EnvironmentProps;
  return 'dev';
};

export const setEnvironment = (env: EnvironmentProps) => {
  settings.setSync(ENVIRONMENT_SETTINGS_KEY, env);
};
