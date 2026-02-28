import {
  JOB_SEARCH_INTERACTION_TYPES,
  JobSearchInteractionSource,
  JobSearchInteractionType
} from "../../../../shared/features/job-search";

const type: JobSearchInteractionType = 'email';

export const getJobSearchInteractionSourceFieldValue = (
  source?: JobSearchInteractionSource
): {
  type: JobSearchInteractionType;
  value: string;
} => {
  if (!source) return { type: 'email', value: '' };
  const config = JOB_SEARCH_INTERACTION_TYPES.find(({ name }) => source[name]);
  if (!config) return { type: 'email', value: '' };
  const value = source[config.name] || type;
  return {
    type: config.name,
    value,
  };
};