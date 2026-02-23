import { create } from "zustand";

// All these represent an "open" state.
type State = {
  interactionCreator: boolean;
  interactionEditor?: string;
};

type Action = {
  closeInteractionEditor: () => void;
  openInteractionEditor: (interactionId: string) => void;
  toggleInteractionCreator: () => void;
};

export const jobSearchDashboardLayoutStore = create<State & Action>((set) => ({
  interactionCreator: true,
  closeInteractionEditor: () => set((state) => ({ ...state, interactionEditor: undefined })),
  openInteractionEditor: (interactionId) => set((state) => ({ ...state, interactionCreator: false, interactionEditor: interactionId })),
  toggleInteractionCreator: () => set((state) => ({ ...state, interactionCreator: !state.interactionCreator })),
}));

