import { OptionalId } from "@shared/lib/typesaurus";
import { hydratorFactory } from "@shared/utilities/initialiser";
import { JobSearchApplicationTransfer } from "../types";

const initial: OptionalId<JobSearchApplicationTransfer> = {
  audit: [],
  interactions: [],
  notes: '',
  pending: false,
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
