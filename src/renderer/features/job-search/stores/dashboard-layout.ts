import { JobSearchArchetype } from "../../../../shared/features/job-search";
import { create } from "zustand";

type Id = JobSearchArchetype['id']['interactions'];

// All these represent an "open" state.
type State = {
  interactionCreator: boolean;
  interactionEditor?: Id;
};

type Action = {
  closeInteractionEditor: () => void;
  openInteractionEditor: (interactionId: Id) => void;
  toggleInteractionCreator: () => void;
};

export const jobSearchDashboardLayoutStore = create<State & Action>((set) => ({
  interactionCreator: true,
  closeInteractionEditor: () => set((state) => ({ ...state, interactionEditor: undefined })),
  openInteractionEditor: (interactionId) => set((state) => ({ ...state, interactionCreator: false, interactionEditor: interactionId })),
  toggleInteractionCreator: () => set((state) => ({ ...state, interactionCreator: !state.interactionCreator })),
}));

