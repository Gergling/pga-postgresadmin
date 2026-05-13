import zod, { ZodOptional, ZodString, ZodType } from 'zod';

export const applicationSettingsSchemaFactory = <T extends ZodType>(
  secured: T = zod.string().optional() as unknown as T
) => zod.object({
  firebase: zod.object({
    production: secured,
  }).optional(),
  gemini: zod.object({
    apiKey: secured,
  }).optional(),
  gmail: zod.object({
    host: zod.string().optional(),
    user: zod.string().optional(),
    pass: secured,
  }).optional(),
  projects: zod.object({
    path: zod.string().optional(),
  }).optional(),
});

export const APPLICATION_SETTINGS_SCHEMA = applicationSettingsSchemaFactory<ZodOptional<ZodString>>();

export type ApplicationSettings = zod.infer<typeof APPLICATION_SETTINGS_SCHEMA>;
