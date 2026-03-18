import { CrmCompanySummary, CrmPersonSummary } from "../../../features/crm";
import { Summary } from "../../../lib/typesaurus";
import { JobSearchApplicationInteractionPersistent, JobSearchApplicationPersistent, JobSearchInteractionPersistent } from "./persistent";

export type JobSearchApplicationSummary = 
  & Summary<JobSearchApplicationPersistent, 'role' | 'salary'>
  & {
    agency?: CrmCompanySummary;
    company?: CrmCompanySummary;
    manager?: CrmPersonSummary;
    referral?: CrmPersonSummary;
  }
;

export type JobSearchInteractionSummary = 
  // There is no flat "name" field in this case, so we just pick out the id and assemble the rest of the type.
  & Pick<JobSearchInteractionPersistent, 'id'>
  & {
    person?: CrmPersonSummary;
    time: JobSearchInteractionPersistent['timeperiod']['start'];
  }
;

export type JobSearchApplicationInteractionSummary =
  & JobSearchApplicationInteractionPersistent
  & Summary<JobSearchApplicationPersistent, 'role'>
  & {
    application: JobSearchApplicationSummary;
    interaction: JobSearchInteractionSummary;
  }
;

