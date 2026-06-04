import { Temporal } from "@js-temporal/polyfill";
import { TEMPORAL_GRANULARITIES, TemporalGranularity } from "../config";
import { generateZeroFrequencies, getFrequencyKey } from "./frequencies";
import { TemporalFrequencies, TemporalGranularitySummaryPopulation, TemporalPeriod } from "../schema";

/**
 * Maps a date to a granularity level and a breakdown key (which is a
 * consistent string date/time).
 * @param date The date to be processed as a Temporal.ZonedDateTime.
 * @returns A reducer which takes a TemporalFrequencies date and a
 * TemporalGranularity level.
 */
export const reduceTemporalFrequenciesFactory = (
  date: Temporal.ZonedDateTime
) => (
  acc: TemporalFrequencies,
  granularity: TemporalGranularity
): TemporalFrequencies => {
  const granularFrequencies = acc[granularity];
  const reset = granularFrequencies.quantise;
  const breakdownKey = getFrequencyKey(reset(date));
  const temporalFrequency = granularFrequencies.frequencies[breakdownKey];
  const value = temporalFrequency ? temporalFrequency.value + 1 : 1;
  return {
    ...acc,
    [granularity]: {
      ...granularFrequencies,
      frequencies: {
        ...granularFrequencies.frequencies,
        [breakdownKey]: { ...temporalFrequency, value },
      },
    },
  };
};

/**
 * Summarises the data in terms of the TemporalGranularitySummaryPopulation.
 * @param worst The "worst" of these values so far, usually because something
 * has a value of 0.
 * @param { category, value } TemporalPeriod A time period.
 * @returns Either the same TemporalGranularitySummaryPopulation or a worse one.
 */
export const reduceSummaryPopulatedStatus = (
  worst: TemporalGranularitySummaryPopulation,
  { category, value }: TemporalPeriod
): TemporalGranularitySummaryPopulation => {
  if (value > 0 || worst === 'insufficient') return worst;
  if (category === 'prior') return 'last';
  return 'insufficient';
}

/**
 * Reducer for adding a summary to the 
 * @param acc 
 * @param granularity 
 * @returns 
 */
export const reduceTemporalGranularitySummary = (
  acc: TemporalFrequencies, granularity: TemporalGranularity
) => {
  const tfg = acc[granularity];
  const populated = Object.values(tfg.frequencies).reduce(
    reduceSummaryPopulatedStatus, 'full'
  );
  return {
    ...acc,
    [granularity]: {
      ...tfg,
      summary: {
        populated,
      }
    },
  };
};

export const recencyFactory = (now = Temporal.Now.zonedDateTimeISO()) => {
  const base = generateZeroFrequencies(now);

  const getTemporalFrequencies = (
    dates: Temporal.ZonedDateTime[]
  ): TemporalFrequencies => {
    if (dates.length === 0) return base;
    const tf = dates.reduce((acc, date) => TEMPORAL_GRANULARITIES
      .reduce(reduceTemporalFrequenciesFactory(date), acc),
      base
    );
    return TEMPORAL_GRANULARITIES.reduce(reduceTemporalGranularitySummary, tf);
  };

  return {
    getTemporalFrequencies,
  };
};
