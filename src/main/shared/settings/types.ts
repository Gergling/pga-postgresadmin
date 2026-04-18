import { SETTINGS_KEY_APPLICATION, SETTINGS_KEY_ENVIRONMENT } from "@shared/lib/settings";
import { MutationResponse } from "../../../shared/types";
import { ApplicationSettings } from "@shared/features/settings";

export type EnvironmentProps = 'dev' | 'prod';
export type GetEnvironment = () => EnvironmentProps;
export type SetEnvironment = (env: EnvironmentProps) => Promise<MutationResponse<EnvironmentProps>>;

export type AllSettings = {
  [K in typeof SETTINGS_KEY_APPLICATION]: ApplicationSettings;
} & {
  [K in typeof SETTINGS_KEY_ENVIRONMENT]: EnvironmentProps;
};
