// import settings from 'electron-settings';
import { SETTINGS_KEY_APPLICATION } from '@shared/lib/settings';
import { ApplicationSettings } from '@shared/features/settings';
import { getElectronSetting, setElectronSetting } from '@main/shared/settings';

const defaultValues: ApplicationSettings = {
  firebase: {
    production: JSON.stringify({ a: 'production-placeholder' }),
    development: JSON.stringify({ a: 'development-placeholder' }),
  },
  gemini: {
    apiKey: 'GEMINI_API_KEY_HERE',
  },
  gmail: {
    host: 'HOSTING FOR YOU TONIGHT',
    user: 'I THOUGHT IT WAS REAL, BUT HE WAS JUST A USER',
    pass: 'YOU SHALL NOT PASS',
  },
  projects: {
    path: 'THE PATH TO HELL IS PAVED WITH TEST DATA',
  },
};

export const fetchSettings = async (): Promise<
  ApplicationSettings
> => {
  const settings = await getElectronSetting(SETTINGS_KEY_APPLICATION);
  if (settings) return settings;
  return defaultValues;
};

export const updateSettings = async (
  props: ApplicationSettings
): Promise<ApplicationSettings> => {
  await setElectronSetting(SETTINGS_KEY_APPLICATION, props);
  return props;
};
