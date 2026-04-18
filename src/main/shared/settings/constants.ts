import { SETTINGS_KEY_ENVIRONMENT } from "@shared/lib/settings";
import { EnvironmentProps } from "./types";

/**
 * @deprecated Use SETTINGS_KEY_ENVIRONMENT instead.
 */
export const ENVIRONMENT_SETTINGS_KEY = SETTINGS_KEY_ENVIRONMENT;

export const ENVIRONMENTS: EnvironmentProps[] = ['dev', 'prod'];
