import { jobSearchDb } from "../schema";
import { fetchManyEmployments } from "../../crm/crud";
import { JobSearchApplication } from "../../../../shared/features/job-search";

export const fetchActiveApplications = async (): Promise<JobSearchApplication[]> => {
  const applications = await jobSearchDb.applications.query(($) => [
    $.field('phase').notIn(['successful', 'rejected']),
  ]);
  const applicationIds = applications.map(({ ref }) => ref.id);

  // Load the application contacts.
  const applicationContacts = await jobSearchDb.applicationContacts.query(($) => [
    $.field('applicationId').in(applicationIds),
  ]);

  // Load the employments and assign the contacts to the appropriate applications.
  const employmentIds = applicationContacts.map(({ data }) => data.employmentId);
  const { companies, contacts, employments } = await fetchManyEmployments(employmentIds);

  return applications.map(({
    data: { agencyId, companyId, managerId, referralId, ...data },
    ref: { id: appId }
  }) => {
    const appLinks = applicationContacts.filter(l => l.data.applicationId === appId);
    const agency = agencyId && companies.get(agencyId);
    const company = companyId && companies.get(companyId);
    const manager = managerId && contacts.get(managerId);
    const referral = referralId && contacts.get(referralId);
    return {
      ...data,
      id: appId,
      agency,
      company,
      manager,
      referral,
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
      }, [])
    };
  });
};

// Create and update applications.
export const createApplication = async (application: any) => {
  const { id, ...data } = application;
  // Will need to take care of application contacts and convert the object to an id. Same with the update.
  return await jobSearchDb.applications.add(data);
};

// export const updateApplication = async (id: string, application: any) => {
//   const { id, ...data } = application;
//   return await jobSearchDb.applications.update(id, data);
// };
