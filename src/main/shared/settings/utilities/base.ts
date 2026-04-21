import settings from 'electron-settings';
import {
  SETTINGS_KEY_APPLICATION,
  SETTINGS_KEY_ENVIRONMENT,
  SettingsKey
} from "@shared/lib/settings";
import { ApplicationSettings } from "@shared/features/settings";
import { AllSettings, EnvironmentProps } from "../types";

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
