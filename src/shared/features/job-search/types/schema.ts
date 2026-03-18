import {
  ApplicationPhaseName,
  ApplicationStageTechnicalLevel,
  JobSearchInteractionType,
  RoleSeniority
} from "../config";

export type JobSearchApplicationStageSchema = {
  // Computed from the timeline, if in the past.
  completed: boolean;
  // For those unstructured data blues.
  notes: string;
  // Briefly describes the technical level. Intro discussions are low, tech
  // tests are high and architectural/behavioural are medium.
  technical: ApplicationStageTechnicalLevel;
  // Scheduled interviews or tests are synchronous, take-home tests aren't.
  // Robot interviewers are synchronous for now.
  // Early in the process, I won't know when this is scheduled or what the deadline is.
  // I am assuming I will know whether the stage is synchronous or asynchronous.
  // I can extrapolate based on whether I have a deadline (a single date) or a time range (an appointment).
  timeline: 'asynchronous' | 'synchronous' | number | { start: number; end: number; };
};

export type JobSearchApplicationSchemaSalary = {
  // Undefined if unknown.
  // The numbers are equal if a single number is provided.
  min?: number;
  max?: number;
};

export type JobSearchApplicationSchema = {
  // Status.
  pending: boolean;
  phase: ApplicationPhaseName;

  // The actual job.
  role: string;
  salary: JobSearchApplicationSchemaSalary;
  onSite?: // Undefined if they don't tell you about going into the office or it's not known.
    | boolean // Fully remote is false, fully in-office is true.
    | number // A number of days per week is specified (can calculate is specified per month or other equivalent).
    | 'hybrid' // It's a hybrid role, but they don't say often you go in.
    | { min: number; max: number; }; // They tell you a minimum and maximum number of days.
  seniority?: RoleSeniority;

  // Process.
  expectedUpdateTime?: number; // If they have told me when they will get back to me.
  offer?: { // If an offer has been made....
    notes: string;
    salary: number;
  };
  sourceType: 'agent' | 'listing';
  stages: JobSearchApplicationStageSchema[]; // Application stages (if known, otherwise empty array).

  // Unstructured text, for things like the kob description, etc.
  notes: string;
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

export type JobSearchInteractionSchema = {
  contentReference?: string; // This could be an email fragment id, for example. It will depend on the source.
  due?: number; // If the interaction was for an update given at due time, this is that time.
  notes: string; // When all other forms of structured data fail...
  source: JobSearchInteractionSource;
  timeperiod: { start: number; end?: number; };
};

export type JobSearchApplicationInteractionSchema = {
  // applicationId: ApplicationId;
  // interactionId: JobSearchArchetype['id']['interactions'];
};
