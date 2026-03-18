import { hydratorFactory } from "../../../utilities/initialiser";
import { JobSearchInteractionCreation } from "../types";

const initial: JobSearchInteractionCreation = {
  applications: [],
  notes: '',
  timeperiod: { start: Date.now() },
  source: {
    entry: 'manual',
  },
};
export const hydrateJobSearchInteraction = hydratorFactory<JobSearchInteractionCreation>({
  initial,
  initialiser: (interaction) => {
    return {
      ...initial,
      ...interaction,
    };
  },
});
