import { JobSearchApplication, JobSearchApplicationContact } from "../../../shared/features/job-search";

export type DbJobSearchApplication = JobSearchApplication & {
  companyId: string;
};

export type DbJobSearchApplicationContact = {
  id: string;
  applicationId: string;
} & ({
  contactId?: never;
  employmentId: string; // Links to a DbEmployment
} | {
  contactId: string; // Links to a DbContact
  employmentId?: never;
});

export type DbJobSearchApplicationIpc = JobSearchApplication & {
  contacts: JobSearchApplicationContact[];
};
