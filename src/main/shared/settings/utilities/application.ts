import { SETTINGS_KEY_APPLICATION } from "@/shared/lib/settings";
import {
  ApplicationSettings,
  applicationSettingsSchemaFactory
} from "@/shared/features/settings";
import {
  decryptTransformer,
  encryptTransformer,
} from "@/main/shared/encryption";
import { loadElectronSettings, saveElectronSettings } from "./base";

const loadSchema = applicationSettingsSchemaFactory(decryptTransformer);
const saveSchema = applicationSettingsSchemaFactory(encryptTransformer);

export const loadAppSettings = async (): Promise<ApplicationSettings> => {
  const settings = await loadElectronSettings(SETTINGS_KEY_APPLICATION);
  return loadSchema.parse(settings);
};

export const saveAppSettings = async (
  props: ApplicationSettings
): Promise<ApplicationSettings> => {
  const encrypted = saveSchema.parse(props);
  await saveElectronSettings(SETTINGS_KEY_APPLICATION, encrypted);
  return props;
};
