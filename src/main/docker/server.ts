import settings from 'electron-settings';
import keytar from 'keytar';
import { DatabaseServerCredentials } from '../../shared/docker-postgres/types';
import { GeneralResponse } from '../../shared/types';

const DATABASE_SERVER_CREDENTIALS_KEY = 'databaseServerCredentials';
const DATABASE_SERVER_PASSWORD_KEY = 'PostgresAdmin';

export const loadDatabaseServerCredentials = async (): Promise<DatabaseServerCredentials | undefined> => {
  const credentials = await settings.get(DATABASE_SERVER_CREDENTIALS_KEY) as DatabaseServerCredentials | null;

  if (!credentials) return;

  const password = await keytar.getPassword(DATABASE_SERVER_PASSWORD_KEY, credentials.user) || undefined;

  return {
    ...credentials,
    password,
  };
};

export const saveDatabaseServerCredentials = async (credentials: DatabaseServerCredentials): Promise<GeneralResponse> => {
  try {
    // 1. Save sensitive data with keytar
    if (credentials.password) {
      await keytar.setPassword(DATABASE_SERVER_PASSWORD_KEY, credentials.user, credentials.password);
    }
    
    // 2. Save non-sensitive data with electron-store
    settings.set(DATABASE_SERVER_CREDENTIALS_KEY, {
      user: credentials.user,
      host: credentials.host,
      port: credentials.port,
      database: credentials.database
    });

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
