import zod from 'zod';

export const APPLICATION_SETTINGS_SCHEMA = zod.object({
  firebase: zod.object({
    production: zod.string(),
    development: zod.string(),
  }),
  gemini: zod.object({
    apiKey: zod.string(),
  }),
  gmail: zod.object({
    host: zod.string(),
    user: zod.string(),
    pass: zod.string(),
  }),
  projects: zod.object({
    path: zod.string(),
  }),
});

export type ApplicationSettings = zod.infer<typeof APPLICATION_SETTINGS_SCHEMA>;
