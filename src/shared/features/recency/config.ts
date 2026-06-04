export const RECENCY_GROUPS = [
  'today',
  'recent days',
  'recent weeks',
  'recent months',
  'this year', 'last year',
  'older',
] as const;

export type RecencyGroupName = typeof RECENCY_GROUPS[number];

/**
 * @deprecated Use the zod schema.
 */
const TEMPORAL_GRANULARITIES = [
  'years', 'months', 'weeks', 'days'
] as const;
type TemporalGranularity = typeof TEMPORAL_GRANULARITIES[number];
/**
 * @deprecated Use the zod schema.
 */
export const TEMPORAL_GRANULARITIES_DESC = TEMPORAL_GRANULARITIES.reduce(
  (acc, granularity) => [granularity, ...acc], [] as TemporalGranularity[]
);
