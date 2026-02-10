import { JobSearchInteractionType } from "../config";

type InteractionPayload = {
  [K in JobSearchInteractionType]: {
    [P in K]: string; // The active key is a string
  } & {
    [P in Exclude<JobSearchInteractionType, K>]?: never; // All other keys must be absent/never
  };
}[JobSearchInteractionType];
type JobSearchInteractionSource = {
  entry: 'manual' | 'llm';
} & InteractionPayload;
export type JobSearchInteraction = {
  id: string;
  source: JobSearchInteractionSource;
};
