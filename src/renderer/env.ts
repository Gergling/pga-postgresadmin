export const getEnvVar = (key: keyof ImportMetaEnv): string => {
  if (!import.meta.env[key]) throw new Error(`Missing renderer environment variable: ${key}`);
  return import.meta.env[key];
};
