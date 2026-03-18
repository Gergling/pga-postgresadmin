import { Schema } from "../../../lib/typesaurus";
import {
  JobSearchApplicationSchema,
  JobSearchApplicationInteractionSchema,
  JobSearchInteractionSchema
} from "./schema";

export type JobSearchSchema = Schema<{
  applications: JobSearchApplicationSchema,
  interactions: JobSearchInteractionSchema,
  applicationInteractions: JobSearchApplicationInteractionSchema,
}>;

export type JobSearchApplicationPersistent = JobSearchSchema['persistent']['applications'];
export type JobSearchInteractionPersistent = JobSearchSchema['persistent']['interactions'];
export type JobSearchApplicationInteractionPersistent = JobSearchSchema['persistent']['applicationInteractions'];
