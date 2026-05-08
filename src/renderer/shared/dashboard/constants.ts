import {
  TEMPORAL_GRANULARITIES,
  TemporalGranularity,
  TemporalGranularitySummaryPopulation
} from "@shared/features/recency";

export const TEMPORAL_GRANULARITY_WEIGHTS = TEMPORAL_GRANULARITIES.reduce(
  (acc, granularity, index, arr) => ({
    ...acc,
    [granularity]: (index + 1) / arr.length,
  }), {} as Record<TemporalGranularity, number>
);

export const TEMPORAL_GRANULARITY_SUMMARY_WEIGHTS: Record<
  TemporalGranularitySummaryPopulation, number
> = {
  insufficient: 0,
  last: 0.5,
  full: 1,
};
