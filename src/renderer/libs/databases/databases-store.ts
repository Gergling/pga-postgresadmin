// src/store.ts
import { create } from 'zustand';
import { DatabaseItem, DatabaseResponseSelect } from '../../shared/database/types';

interface StoreState {
  databases: DatabaseItem[];
  error: string | undefined;
  loading: string | undefined;
}
interface StoreActions {
  // create: () => void;
  fetch: (selectDatabases: () => Promise<DatabaseResponseSelect<DatabaseItem>>) => void;
}
type Store = StoreState & StoreActions;

export const useDatabases = create<Store>((set) => ({
  databases: [],
  error: undefined,
  loading: undefined,
  fetch: (selectDatabases) => {
    set({ loading: 'Fetching databases' });

    selectDatabases()
      .then((response) => {
        if (response.success === false) {
          console.error('Failed to fetch databases:', response.error);
          return set({ error: response.error });
        }

        set({ databases: response.data, error: undefined });
      })
      .catch((error) => {
        console.error('Error fetching databases:', error);
        set({ error });
      })
      .finally(() => {
        set({ loading: undefined });
      });
  },
}));
