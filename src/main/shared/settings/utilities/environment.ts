import settings from 'electron-settings';
import { SETTINGS_KEY_ENVIRONMENT } from '@shared/lib/settings';
import { ENVIRONMENTS } from '../constants';
import { EnvironmentProps, GetEnvironment } from '../types';

export const getEnvironment: GetEnvironment = () => {
  const envValue = settings.getSync(SETTINGS_KEY_ENVIRONMENT) as string | null;
  if (envValue && (ENVIRONMENTS as string[]).includes(envValue)) {
    return envValue as EnvironmentProps;
  }
  return 'dev';
};

export const setEnvironment = (env: EnvironmentProps) => {
  settings.setSync(SETTINGS_KEY_ENVIRONMENT, env);
};
