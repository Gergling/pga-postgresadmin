import { getEnvVar } from "@main/env";

export const GEMINI_API_KEY = getEnvVar('VITE_GEMINI_API_KEY');
export const GEMINI_DEFAULT_MODEL = 'gemini-flash-latest';
