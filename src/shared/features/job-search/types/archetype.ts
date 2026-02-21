import { Archetype } from "../../../../shared/lib/typesaurus";
import { CrmArchetype } from "../../../../shared/features/crm";
import { ApplicationPhaseName, JobSearchInteractionType } from "../config";

type CrmId = CrmArchetype['id'];
type ApplicationId = JobSearchArchetype['id']['applications'];

type JobSearchApplicationContact = CrmArchetype['base']['employments'] & {
  // Needs a contact and employer
  // type: 'agency' | 'hiring';
};

export type JobSearchApplicationStage = {
  // Computed from the timeline, if in the past.
  completed: boolean;
  // For those unstructured data blues.
  notes: string;
  // There is always a person, but I might not know who it is, so undefined
  // always represents "don't know".
  person?: CrmArchetype['base']['people'];
  // Stages usually link to a phase, commonly "issued" and "booked", as these
  // are the earliest points at which this phase will complete.
  // Obviously previous phases have to complete first.
  phase: ApplicationPhaseName;
  // Briefly describes the technical level. Intro discussions are low, tech
  // tests are high and architectural/behavioural are medium.
  technical: 'low' | 'medium' | 'high';
  // Scheduled interviews or tests are synchronous, take-home tests aren't.
  // Robot interviewers are synchronous for now.
  // Early in the process, I won't know when this is scheduled or what the deadline is.
  // I am assuming I will know whether the stage is synchronous or asynchronous.
  // I can extrapolate based on whether I have a deadline (a single date) or a time range (an appointment).
  timeline: 'asynchronous' | 'synchronous' | number | { start: number; end: number; };
};

type JobSearchApplication = {
  // Status.
  phase: ApplicationPhaseName;

  // The actual job.
  role: string;
  salary: {
    // Undefined if unknown.
    // The numbers are equal if a single number is provided.
    min?: number;
    max?: number;
  };

  // Process.
  offer?: { // If an offer has been made....
    notes: string;
    salary: number;
  };
  sourceType: 'agent' | 'listing';
  stages: JobSearchApplicationStage[]; // Application stages (if known, otherwise empty array).

  // Contacts.
  contacts: JobSearchApplicationContact[]; // Random related contacts.

  agency?: CrmArchetype['base']['companies']; // The representing agency (if known).
  company?: CrmArchetype['base']['companies']; // Company with the position (if known).
  manager?: CrmArchetype['base']['people']; // Hiring manager (if known).
  referral?: CrmArchetype['base']['people']; // If the role was referred (if there is one).

  interactions: JobSearchInteraction[];

  // Unstructured text, for things like the kob description, etc.
  notes: string;
};


type JobSearchApplicationModelType = Omit<
  JobSearchApplication,
  'contacts' | 'agency' | 'company' | 'manager' | 'referral' | 'interactions' | 'stages'
> & {
  agencyId?: CrmId['companies'];
  companyId?: CrmId['companies'];
  managerId?: CrmId['people'];
  referralId?: CrmId['people'];
  stages: (Omit<JobSearchApplicationStage, 'completed' | 'person'> & { personId?: CrmId['people'] })[];
};

type JobSearchApplicationContactBase = {
  application: JobSearchArchetype['base']['applications'];
  employment: CrmArchetype['base']['employments'];
  // type: 'agency' | 'hiring';
};
type JobSearchApplicationContactModelType = {
  applicationId: ApplicationId;
  employmentId: CrmId['employments'];
};

// This is an abstracted contact id. It could be an email address, phone number or something else.
type InteractionPayload = {
  [K in JobSearchInteractionType]: {
    [P in K]: string; // The active key is a string
  } & {
    [P in Exclude<JobSearchInteractionType, K>]?: never; // All other keys must be absent/never
  };
}[JobSearchInteractionType];

// This describes whether the source material was handled by manual input or an
// llm as part of the overall source description.
type JobSearchInteractionSource = {
  entry: 'manual' | 'llm';
} & (InteractionPayload | Partial<Record<JobSearchInteractionType, never>>);

// This is one interaction for one person or possibly robot.
type JobSearchInteraction = {
  application?: JobSearchArchetype['base']['applications'];
  contentReference?: string; // This could be an email fragment id, for example. It will depend on the source.
  notes: string; // When all other forms of structured data fail...
  person?: CrmArchetype['base']['people']; // If a person can be tied to the interaction, great.
  source: JobSearchInteractionSource;
  timestamp: number;
};


type JobSearchInteractionModelType = Omit<JobSearchInteraction, 'application' | 'person'> & {
  applicationId?: ApplicationId;
  personId?: CrmId['people'];
};

export type JobSearchArchetype = Archetype<
  {
    applications: { base: JobSearchApplication; model: JobSearchApplicationModelType; };
    applicationContacts: { base: JobSearchApplicationContactBase; model: JobSearchApplicationContactModelType; };
    interactions: { base: JobSearchInteraction; model: JobSearchInteractionModelType; };
  }
>;
