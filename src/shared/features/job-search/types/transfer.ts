import { CrmPersonSummary } from "../../../features/crm";
import { JobSearchApplicationRecord, JobSearchInteractionRecord } from "./record";
import { JobSearchApplicationSchema, JobSearchInteractionSchema } from "./schema";

export type JobSearchApplicationTransfer =
  & Omit<JobSearchApplicationRecord, 'salary'>
  & Pick<JobSearchApplicationSchema, 'salary'>
;
export type JobSearchInteractionTransfer = JobSearchInteractionRecord;

export type JobSearchApplicationCreation = JobSearchApplicationSchema;
export type JobSearchInteractionCreation = 
  & JobSearchInteractionSchema // Possibly this has too many mandatory properties...
  & {
    applications: JobSearchApplicationCreation[];
    person?: CrmPersonSummary;
  }
;

// Mostly for things like the update form special case, since we don't want to send back an interaction with just summaries.
export type JobSearchUpdateTransfer = {
  applications: JobSearchApplicationTransfer[];
  id: JobSearchInteractionTransfer['id'];
  interaction: JobSearchInteractionTransfer;
};
