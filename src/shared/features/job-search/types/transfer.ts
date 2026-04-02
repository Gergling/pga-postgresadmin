import { Mandatory } from "@shared/types";
import { CrmPersonSummary } from "../../../features/crm";
import { JobSearchApplicationRecord, JobSearchInteractionRecord } from "./record";
import { JobSearchApplicationSchema, JobSearchInteractionSchema } from "./schema";

export type JobSearchApplicationTransfer =
  & Omit<JobSearchApplicationRecord, 'salary'>
  & Pick<JobSearchApplicationSchema, 'salary'>
;
export type JobSearchInteractionTransfer = JobSearchInteractionRecord;

export type JobSearchApplicationCreation = 
  & JobSearchApplicationSchema
  & {
    interactions: JobSearchInteractionSchema[];
  }
;
export type JobSearchInteractionCreation = 
  & JobSearchInteractionSchema // Possibly this has too many mandatory properties...
  & {
    applications: JobSearchApplicationSchema[];
    person?: CrmPersonSummary;
  }
;

// It's possible to submit a payload from the form that contains 0 or 1
// interactions and 0 or more applications.
type JobSearchUpdateBase = {
  applications: JobSearchApplicationCreation[];
  interaction: JobSearchInteractionCreation;
};
export type JobSearchUpdateCreation = 
  | Mandatory<JobSearchUpdateBase, 'applications'>
  | Mandatory<JobSearchUpdateBase, 'interaction'>
;

// Mostly for things like the update form special case, since we don't want to
// send back an interaction with just summaries.
export type JobSearchUpdateTransfer = {
  applications: JobSearchApplicationTransfer[];
  id: JobSearchInteractionTransfer['id'];
  interaction: JobSearchInteractionTransfer;
};
