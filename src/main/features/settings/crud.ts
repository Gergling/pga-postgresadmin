import z from 'zod';
import { SETTINGS_KEY_APPLICATION } from '@shared/lib/settings';
import { APPLICATION_SETTINGS_SCHEMA, ApplicationSettings } from '@shared/features/settings';
import { secureCodec } from '@main/shared/encryption';
import { getElectronSetting, setElectronSetting } from '@main/shared/settings';

const schema = APPLICATION_SETTINGS_SCHEMA.extend({
  firebase: APPLICATION_SETTINGS_SCHEMA.shape.firebase.extend({
    production: secureCodec,
    development: secureCodec,
  }),
  gemini: APPLICATION_SETTINGS_SCHEMA.shape.gemini.extend({
    apiKey: secureCodec,
  }),
  gmail: APPLICATION_SETTINGS_SCHEMA.shape.gmail.extend({
    pass: secureCodec,
  })
});

type Schema = z.infer<typeof schema>;

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
  Schema
> => {
  const settings = await getElectronSetting(SETTINGS_KEY_APPLICATION);
  if (settings) return schema.decode(settings);
  return defaultValues;
};

export const updateSettings = async (
  props: ApplicationSettings
): Promise<ApplicationSettings> => {
  const encrypted = schema.encode(props);
  await setElectronSetting(SETTINGS_KEY_APPLICATION, encrypted);
  return props;
};
