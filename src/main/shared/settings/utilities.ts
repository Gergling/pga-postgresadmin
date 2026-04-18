import settings from 'electron-settings';
import {
  SETTINGS_KEY_APPLICATION,
  SETTINGS_KEY_ENVIRONMENT,
  SettingsKey
} from '@shared/lib/settings';
import { ApplicationSettings } from '@shared/features/settings';
import { ENVIRONMENTS } from './constants';
import { AllSettings, EnvironmentProps, GetEnvironment } from './types';

type AppKey = typeof SETTINGS_KEY_APPLICATION;
type EnvKey = typeof SETTINGS_KEY_ENVIRONMENT;

export function getElectronSetting(
  key: AppKey
): Promise<ApplicationSettings | null>;
export function getElectronSetting(
  key: EnvKey
): Promise<EnvironmentProps | null>;
export function getElectronSetting(key: SettingsKey) {
  return settings.get(key);
}

export const setElectronSetting = async <
  Key extends SettingsKey, Value extends AllSettings[Key]
>(key: SettingsKey, value: Value) => settings.set(key, value);

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


