export const RECENCY_GROUPS = [
  'today',
  'recent days',
  'recent weeks',
  'recent months',
  'this year', 'last year',
  'older',
] as const;

export type RecencyGroupName = typeof RECENCY_GROUPS[number];

export const TEMPORAL_GRANULARITIES = [
  'years', 'months', 'weeks', 'days'
] as const;
export type TemporalGranularity = typeof TEMPORAL_GRANULARITIES[number];
