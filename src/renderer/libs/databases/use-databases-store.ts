import { create } from 'zustand';
import { DatabaseItem } from '../../../shared/database/types';
import { getIpc } from '../../shared/ipc/util';

interface StoreState {
  databases: DatabaseItem[];
  error: string | undefined;
  loading: boolean;
}
interface StoreActions {
  create: (name: string) => Promise<void>;
  fetch: () => void;
}
type Store = StoreState & StoreActions;

export const useDatabasesStore = create<Store>((set, get) => ({
  databases: [],
  error: undefined,
  loading: false,
  create: async (name) => {
    const { createDatabase } = getIpc();
    const { fetch } = get();
    set({ loading: true });
    const { error, success } = await createDatabase(name);
    set({ error, loading: false });
    if (success) {
      fetch();
    }
  },
  fetch: async () => {
    const { selectDatabases } = getIpc();
    set({ loading: true });

    try {
      const response = await selectDatabases();

      if (response.success) {
        set({ databases: response.data });
      } else {
        set({ error: response.error });
      }
    } catch (error) {
      set({ error: error.toString() });
    } finally {
      set({ loading: false });
    }
  },
}));
