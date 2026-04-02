import { JobSearchUpdateForm } from "../types";

export const mapJobSearchUpdateTransfer = ({
  interaction: {
    person, source, timeperiod, ...interactionData
  }, ...applicationData }: JobSearchUpdateForm) => {
    // TODO: Update to support multiple applications submitted from a form.
    // Multi-application assumptions we can make: Agency will be the same OR the company will be the same if there is no agency.
    const {
      agency, company, manager, referral,
      isListingSourceType, notes,
      phase, role, salary, stages,
      pending,
      ...rest
    } = applicationData;
    const application: Optional<JobSearchDbSchema['base']['applications'], 'id'> = {
      ...rest,
      contacts: [],
      interactions: [],
      notes: notes ?? '',
      pending: pending ?? false,
      role: role ?? '',
      salary: salary ?? {},
      sourceType: isListingSourceType ? 'listing' : 'agent',
      stages: stages ?? [],
      phase: getValidPhase(phase) ?? 'sourced',
    };
    
    const interaction: Omit<JobSearchDbSchema['base']['interactions'], 'id'> & {
      timeperiod: {
        start: number;
        end?: number;
      };
    } = {
      ...interactionData,
      applications: [ application ],
      // person: person ?? undefined,
      source: {
        entry: 'manual',
        ...source,
      },
      timeperiod: {
        start: timeperiod.start.getTime(),
        end: timeperiod.end?.getTime(),
      },
    };

    return interaction;
  };



// Transfer to form
// Form to creation
// Form to transfer