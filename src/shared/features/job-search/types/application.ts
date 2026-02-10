// Jobs can have many interviews. Usually introduction, technical, cultural, but can be anything.
// Sometimes there's a "spoke to an agent" status, which occurs immediately before application.

import { Company, Employment, Person } from "../../../../shared/types";
import { ApplicationPhase } from "../config/application";

export type JobSearchApplicationContact = Employment & {
  // Needs a contact and employer
  // type: 'agency' | 'hiring';
};

export type JobSearchApplicationStage = {
  synchronous: boolean; // Scheduled interviews or tests are synchronous,
  // take-home tests aren't. Robot interviewers are synchronous for now.
  technical: 'low' | 'medium' | 'high';
};

export type JobSearchApplication = {
  // Metadata.
  id: string;

  // Status.
  phase: ApplicationPhase;

  // The actual job.
  role: string;
  salary: {
    // Undefined if unknown.
    // The numbers are equal if a single number is provided.
    min?: number;
    max?: number;
  };

  // Process.
  sourceType: 'agent' | 'listing';
  stages?: JobSearchApplicationStage[]; // Application stages (if known).

  // Contacts.
  contacts: JobSearchApplicationContact[]; // Random related contacts.
  agency?: Company; // The representing agency (if known).
  company?: Company; // Company with the position (if known).
  manager?: Person; // Hiring manager (if known).
  referral?: Person; // If the role was referred (if there is one).

  // Unstructured text, for things like the kob description, etc.
  notes: string;
};
