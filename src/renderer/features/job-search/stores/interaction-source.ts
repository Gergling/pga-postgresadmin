import { create } from "zustand";
import { JobSearchInteractionType } from "../../../../shared/features/job-search";

type State = {
  type: JobSearchInteractionType;
  value: string;
};

type Action = {
  setType: (type: JobSearchInteractionType) => void;
  setValue: (value: string) => void;
};

export const jobSearchInteractionSourceStore = create<State & Action>((set) => ({
  type: 'email',
  value: '',
  setType: (type) => set((state) => ({ ...state, type })),
  setValue: (value) => set((state) => ({ ...state, value })),
}));
