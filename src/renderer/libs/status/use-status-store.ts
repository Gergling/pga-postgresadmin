import { create } from "zustand";
import { StatusItemProps } from "./types";

type State = {
  statuses: StatusItemProps[];
};

type Actions = {
  update: (item: StatusItemProps) => void;
  clearStatuses: () => void;
};

const upsertReducer = (state: State, item: StatusItemProps) => {
  const existingItem = state.statuses.find((i) => i.name === item.name);
  if (existingItem) {
    return {
      ...state,
      statuses: state.statuses.map((i) =>
        i.name === item.name ? { ...i, ...item } : i
      ),
    };
  }
  return {
    ...state,
    statuses: [...state.statuses, item],
  };
};

export const useStatus = create<State & Actions>((set) => ({
  statuses: [],
  update: (action) => set((state) => upsertReducer(state, action)),
  clearStatuses: () => set({ statuses: [] }),
}));
