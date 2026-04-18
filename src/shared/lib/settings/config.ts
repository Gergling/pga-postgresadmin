export const SETTINGS_KEY_ENVIRONMENT = 'env';
export const SETTINGS_KEY_APPLICATION = 'app';

const SETTINGS_KEYS = [
  SETTINGS_KEY_ENVIRONMENT,
  SETTINGS_KEY_APPLICATION,
] as const;

export type SettingsKey = typeof SETTINGS_KEYS[number];
