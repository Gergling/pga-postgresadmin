import * as dotenv from 'dotenv';

dotenv.config();

export const getEnvVar = (key: keyof NodeJS.ProcessEnv): string => {
  if (!process.env[key]) throw new Error(`Missing main environment variable: ${key}`);
  return process.env[key];
};
