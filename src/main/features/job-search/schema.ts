// Possibly we want a schema folder in main/. This can go in a "crm.ts" file.

import { schema, Typesaurus } from "typesaurus";
import { JobSearchApplication, JobSearchInteraction } from "../../../shared/features/job-search";
import { CrmSchema } from "../crm";

type JobSearchApplicationModelType = Omit<
  JobSearchApplication,
  | 'agency'
  | 'company'
  | 'contacts'
  | 'id'
  | 'manager'
  | 'referral'
> & {
  agencyId?: CrmSchema['companies']['Id'];
  companyId?: CrmSchema['companies']['Id'];
  managerId?: CrmSchema['people']['Id'];
  referralId?: CrmSchema['people']['Id'];
};

type JobSearchApplicationContactModelType = {
  applicationId: JobSearchSchema['applications']['Id'];
  employmentId: CrmSchema['employment']['Id'];
  // type: 'agency' | 'hiring';
};

type JobSearchInteractionModelType = Omit<JobSearchInteraction, 'id'> & {
  applicationId: JobSearchSchema['applications']['Id'];
  time: number;
};

// Generate the db object from given schem that you can use to access
// Firestore, i.e.:
//   await db.get(userId)
export const jobSearchDb = schema(($) => ({
  applications: $.collection<JobSearchApplicationModelType>(),
  applicationContacts: $.collection<JobSearchApplicationContactModelType>(),
  interactions: $.collection<JobSearchInteractionModelType>(),
}));

// Infer schema type helper with shortcuts to types in your database:
//   function getUser(id: CrmSchema["users"]["Id"]): CrmSchema["users"]["Result"]
export type JobSearchSchema = Typesaurus.Schema<typeof jobSearchDb>;
