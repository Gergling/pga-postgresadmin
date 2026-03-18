import { DbSchema } from "../../../lib/typesaurus";
import {
  CrmPersonSummary
} from "../../crm";
import { JobSearchApplicationInteractionPersistent, JobSearchApplicationPersistent, JobSearchInteractionPersistent, JobSearchSchema } from "./persistent";
import { JobSearchApplicationSchemaSalary, JobSearchApplicationStageSchema } from "./schema";
import { JobSearchApplicationInteractionSummary, JobSearchApplicationSummary, JobSearchInteractionSummary } from "./summary";

type Stage = JobSearchApplicationStageSchema & {
  person?: CrmPersonSummary;
};

export type JobSearchApplicationRecord =
  & Omit<JobSearchApplicationPersistent & JobSearchApplicationSummary, 'salary'>
  & {
    interactions: JobSearchInteractionSummary[];
    salary?: number | JobSearchApplicationSchemaSalary;
    stages: Stage[];
  };

export type JobSearchInteractionRecord =
  & JobSearchInteractionPersistent
  & {
    applications: JobSearchApplicationSummary[];
    person?: CrmPersonSummary;
  };

export type JobSearchApplicationInteractionRecord = 
  & JobSearchApplicationInteractionPersistent
  & JobSearchApplicationInteractionSummary
;

export type JobSearchDbSchema = DbSchema<JobSearchSchema, {
  applications: JobSearchApplicationRecord;
  interactions: JobSearchInteractionRecord;
  applicationInteractions: JobSearchApplicationInteractionRecord;
}>;