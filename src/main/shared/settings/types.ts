import z from "zod";
import { MutationResponse } from "@/shared/types";
import {
  SETTINGS_KEY_APPLICATION,
  SETTINGS_KEY_ENVIRONMENT
} from "@/shared/lib/settings";
import { ApplicationSettings } from "@/shared/features/settings";

// const EnvironmentPropsSchemaBase = z.union(
//   ['dev', 'prod'].map((env) => z.literal(env))
// );

export const EnvironmentPropsSchema = z
  .string()
  .nullable()
  .default("dev") // Provides a fallback for nulls
  .pipe(z.enum(['dev', 'prod']));



// const environmentCodec = z.codec(
//   EnvironmentPropsSchemaBase,  // input schema: dev/prod
//   z.union([z.string(), z.null()]),          // output schema: Date object
//   {
//     decode: (isoString) => new Date(isoString), // Input → Output
//     encode: (date) => date.toISOString(),       // Output → Input
//   }
// );

// export const EnvironmentPropsSchema = z.union(
//   ['dev', 'prod'].map((env) => z.literal(env))
// ).nullable().default('dev').transform((value) => value as EnvironmentProps);

export type EnvironmentProps = z.infer<typeof EnvironmentPropsSchema>;
export type GetEnvironment = () => EnvironmentProps;
export type SetEnvironment = (env: EnvironmentProps) => Promise<MutationResponse<EnvironmentProps>>;

export type AllSettings = {
  [K in typeof SETTINGS_KEY_APPLICATION]: ApplicationSettings;
} & {
  [K in typeof SETTINGS_KEY_ENVIRONMENT]: EnvironmentProps;
};
