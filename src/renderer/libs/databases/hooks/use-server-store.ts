import { GeneralResponse } from '../../../../shared/types';
import { DatabaseServerCredentials } from '../../../../shared/docker-postgres/types';
import { create } from 'zustand';
import { getIpc } from '../../../shared/ipc/util';

type CredentialsStatus = 'idle' | 'populated' | 'empty';

interface DatabasesServerState {
  credentials: DatabaseServerCredentials;
  loading: boolean;
  status: CredentialsStatus;
  load: () => Promise<DatabaseServerCredentials | undefined>;
  save: (creds: DatabaseServerCredentials) => Promise<GeneralResponse>;
}


export const useDatabasesServerStore = create<DatabasesServerState>((set) => ({
  credentials: {
    user: '',
    host: '',
    port: 5432,
    database: ''
  },
  loading: false,
  status: 'idle',
  load: async () => {
    set({ loading: true });
    const { loadDatabaseServerCredentials } = getIpc();
    try {
      const credentials = await loadDatabaseServerCredentials();
      if (credentials) {
        set({ credentials, status: 'populated' });
      } else {
        set({ status: 'empty' });
      }
      return credentials;
    } catch (error) {
      console.error('Error loading credentials:', error);
      return undefined;
    } finally {
      set({ loading: false });
    }
  },
  save: async (
    credentials: DatabaseServerCredentials
  ) => {
    const { saveDatabaseServerCredentials } = getIpc();
    try {
      const {
        error,
        success,
      } = await saveDatabaseServerCredentials(credentials);
      if (success) {
        set({ credentials });
        return { success: true };
      }

      return { success: false, error };
    } catch (error) {
      console.error('Error saving credentials:', error);
      return { success: false, error };
    }
  },
}));
