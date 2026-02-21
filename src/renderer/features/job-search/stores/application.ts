import { create } from "zustand";
import { hydrateJobSearchApplication } from "../../../../shared/features/job-search";
import { JobSearchApplicationOptionType, JobSearchUpsertableApplication } from "../types"

type State = {
  model?: JobSearchUpsertableApplication;
  option: JobSearchApplicationOptionType | null;
};

type ActionProps = {
  // We set the state to the option type directly, as this update will dictate
  // the total application state.
  setApplication: (option: State['option'] | null) => void;
};

export const applicationSelectionStore = create<State & ActionProps>((set) => ({
  option: null,
  setApplication: (option) => {
    if (!option) return set((state) => ({
      ...state,
      model: undefined,
      option: null,
    }));
    const hydrated = hydrateJobSearchApplication({ role: option.title });
    set((state) => ({ 
      ...state,
      model: {
        ...hydrated,
        id: option.id,
      },
      option,
    }));
  }
}));
