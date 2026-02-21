import { CrmArchetype } from "../../../../shared/features/crm";
import { JobSearchApplicationStage, JobSearchArchetype } from "../../../../shared/features/job-search";
import { fetchManyEmployments } from "../../crm";
import { jobSearchDb } from "../schema";

const stageIsCompleted = (
  timeline: JobSearchApplicationStage['timeline']
): JobSearchApplicationStage['completed'] => {
  if (typeof timeline === 'object') {
    return timeline.end < Date.now();
  }
  if (typeof timeline === 'number') {
    return timeline < Date.now();
  }
  return false;
};

const hydrateStages = (
  contacts: Map<CrmArchetype['id']['people'], CrmArchetype['base']['people']>,
  stages: JobSearchArchetype['modelType']['applications']['stages'],
): JobSearchArchetype['base']['applications']['stages'] => stages.map((
  { personId, ...stage },
): JobSearchApplicationStage => {
  const { timeline } = stage;
  const completed = stageIsCompleted(timeline);
  const person = personId && contacts.get(personId);
  return {
    ...stage,
    completed,
    person,
  };
});

// TODO: Sorting.
// We want to sort by whether there has been correspondence in the last, say, 2 weeks. If it's older than that, it's probably dead.
// Then we want to sort by salary, although we need to work out what is optimal. E.g. the minimum then the maximum.
// Finally, we can sort by a nuanced activity score.
// We may as well wait until we have a few applications for this though.
export const fetchActiveApplications = async (): Promise<JobSearchArchetype['base']['applications'][]> => {
  const applications = await jobSearchDb.applications.query(($) => [
    $.field('phase').notIn(['successful', 'rejected']),
  ]);
  const applicationIds = applications.map(({ ref }) => ref.id)
    // TODO: ABSOLUTELY FIX THIS BEFORE IT BECOMES TOO INVOLVED
    // This is here because I wanted to clean up the error logs from the backend and firebase hates more than 30 "in" values.
    // The positioning of this limit is not thought through at all.
    // Paging will need to be implemented so that the calls are made for several separate "chunks" of "in" values in batches of 30.
    // In the meantime, we don't have 30 applications so we don't care, and all the data is dev mode junk.
    .slice(0, 30);

  // Load the application contacts.
  // Catch when applicationIds is empty.
  const applicationContacts = applicationIds.length ? await jobSearchDb.applicationContacts.query(($) => [
    $.field('applicationId').in(applicationIds),
  ]) : [];

  // Load the employments and assign the contacts to the appropriate applications.
  const employmentIds = applicationContacts.map(({ data }) => data.employmentId);
  const { companies, contacts, employments } = await fetchManyEmployments({ ids: employmentIds, type: 'employments'});

  // Load the interactions.
  const applicationInteractions = applicationIds.length ? await jobSearchDb.interactions.query(($) => [
    $.field('applicationId').in(applicationIds),
  ]) : [];

  return applications.map(({
    data: { agencyId, companyId, managerId, referralId, ...data },
    ref: { id: appId }
  }) => {
    const appLinks = applicationContacts.filter(l => l.data.applicationId === appId);
    const agency = agencyId && companies.get(agencyId);
    const company = companyId && companies.get(companyId);
    const manager = managerId && contacts.get(managerId);
    const referral = referralId && contacts.get(referralId);
    const stages = hydrateStages(contacts, data.stages);
    const baseApplication: JobSearchArchetype['base']['applications'] = {
      ...data,
      agency, company, manager, referral, stages,
      contacts: [], interactions: [],
      id: appId,
    };
    const interactions: JobSearchArchetype['base']['interactions'][] = applicationInteractions
      .filter(l => l.data.applicationId === appId)
      .map(({ data: { personId, ...data }, ref: { id } }) => ({
        ...data,
        application: baseApplication,
        id,
        person: personId && contacts.get(personId),
      }));
    return {
      ...baseApplication,
      id: appId,
      interactions,
      contacts: appLinks.reduce((acc, { data: { employmentId } }) => {
        const employment = employments.get(employmentId);
        if (!employment) return acc;
        const { company, person, role } = employment;
        return {
          ...acc,
          company,
          person,
          id: employmentId,
          role,
        };
      }, []),
    };
  });
};

// Create will need to omit the 
export const createApplication = async (
  application: Omit<JobSearchArchetype['base']['applications'], 'id'>
): Promise<JobSearchArchetype['base']['applications']> => {
  const {
    contacts,
    agency,
    company,
    manager,
    referral,
    ...rest
  } = application;

  const data = {
    ...rest,
    agencyId: agency?.id,
    companyId: company?.id,
    managerId: manager?.id,
    referralId: referral?.id,
  };

  const ref = await jobSearchDb.applications.add(data);

  if (contacts && contacts.length) {
    await Promise.all(contacts.map((contact) => jobSearchDb.applicationContacts.add({
      applicationId: ref.id,
      employmentId: contact.id,
    })));
  }

  return {
    ...application,
    id: ref.id,
  };
};

export const updateApplication = async (
  application: JobSearchArchetype['base']['applications']
): Promise<JobSearchArchetype['base']['applications']> => {
  const {
    id,
    // contacts,
    agency,
    company,
    manager,
    referral,
    ...rest
  } = application;

  const data: JobSearchArchetype['modelType']['applications'] = {
    ...rest,
    agencyId: agency?.id,
    companyId: company?.id,
    managerId: manager?.id,
    referralId: referral?.id,
  };

  await jobSearchDb.applications.update(id, data);

  // Note: Updating contacts requires a strategy to sync the list (add new, remove old).
  // For now, this is left as a future implementation detail.

  return application;
};


// Create and update applications.
// export const createApplication = async (application: JobSearchApplication) => {
//   const { id, ...data } = application;
//   // Will need to take care of application contacts and convert the object to an id. Same with the update.
//   return await jobSearchDb.applications.add(data);
// };

// export const updateApplication = async (id: string, application: any) => {
//   const { id, ...data } = application;
//   return await jobSearchDb.applications.update(id, data);
// };
