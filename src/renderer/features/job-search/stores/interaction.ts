import { create } from "zustand";
import { Mandatory, Optional, Swap } from "../../../../shared/types";
import { CrmArchetype } from "../../../../shared/features/crm";
import {
  hydrateJobSearchApplication,
  hydrateJobSearchInteraction,
  JobSearchArchetype
} from "../../../../shared/features/job-search";
import { OptionType } from "../../../shared/autocomplete";

type ApplicationProps = Optional<JobSearchArchetype['base']['applications'], 'id'>;
type InteractionProps = Optional<JobSearchArchetype['base']['interactions'], 'id'>;
type PersonProps = Optional<CrmArchetype['base']['people'], 'id'>;

type InteractionStateProps =
  & Omit<InteractionProps, 'application' | 'person'>
  & {
    application?: ApplicationProps;
    person?: PersonProps;
  };

type StateProps = {
  interaction: Optional<InteractionStateProps, 'id'>;
};

type ActionProps = {
  setApplication: (application: OptionType<JobSearchArchetype['id']['applications']> | null) => void;
  setPerson: (person: OptionType<CrmArchetype['id']['people']> | null) => void;
};

type Props = StateProps & ActionProps;

// TODO: Address how this would work with the existing application store.
// Possibly everything needs to be moved into pure functions or something.

export const interactionStore = create<Props>((set) => ({
  // We also need the phase and sourceType.
  // sourceType: We'll have a switch that defaults to agent because it's usually a reactive fill-in triggered by an agent's communique.
  // phase: Depends on sourceType, but can default to the beginning of the
  // process. Should ideally "accordion" some hidden options if we're creating a new application that's part way through the process.
  interaction: hydrateJobSearchInteraction(),
  setApplication: (application) => {
    if (!application) return set((state) => ({ interaction: {
      ...state.interaction,
      application: undefined,
    }}));
    const hydrated = hydrateJobSearchApplication({ role: application.title });
    set((state) => ({ interaction: {
      ...state.interaction,
      application: {
        ...hydrated,
        id: application.id,
      }
    } }));
  },
  setPerson: (person) => set((state) => ({
    interaction: {
      ...state.interaction,
      person: person ? {
        contactId: {},
        employers: [],
        ...person,
        name: person.title,
      } : undefined,
    }
  })),
}));
