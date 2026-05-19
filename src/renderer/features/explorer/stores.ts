import { create } from "zustand";
import { persist } from "zustand/middleware";

const EXPLORER_HISTORY_STORE_KEY = 'explorer-history';

export const explorerHistoryStore = create<{
  history: string[];
  addHistory: (pathname: string) => void;
}>()(persist((set) => ({
  history: [],
  addHistory: (pathname) => set((state) => ({
    history: [pathname, ...state.history],
  })),
}), {
  name: EXPLORER_HISTORY_STORE_KEY, // Key in LocalStorage
}));
