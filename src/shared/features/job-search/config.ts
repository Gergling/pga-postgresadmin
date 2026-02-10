export const JOB_SEARCH_INTERACTION_TYPES = ['email', 'phone', 'other'] as const;
export type JobSearchInteractionType = typeof JOB_SEARCH_INTERACTION_TYPES[number];
