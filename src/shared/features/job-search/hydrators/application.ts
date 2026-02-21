import { hydratorFactory } from "../../../utilities/initialiser";
import { JobSearchArchetype } from "../types";

const initial: Omit<JobSearchArchetype['base']['applications'], 'id'> = {
  contacts: [],
  interactions: [],
  notes: '',
  phase: 'sourced',
  role: '',
  salary: {},
  sourceType: 'agent',
  stages: [],
};
export const hydrateJobSearchApplication = hydratorFactory({
  initial,
  initialiser: (application = {}) => {
    const phase = application.phase || (application.sourceType === 'listing' ? 'queued' : 'sourced');
    return {
      phase,
      ...application,
    };
  },
});
