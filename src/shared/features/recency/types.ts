import { Temporal } from "@js-temporal/polyfill";
import { TemporalGranularity } from "./config";

export type RecencyThresholds = {
  beginningLastYear: number;
  beginningThisYear: number;
  threeMonthsAgo: number;
  threeWeeksAgo: number;
  sevenDaysAgo: number;
  threeDaysAgo: number;
};

/**
 * This type expresses the individual divisions between time periods.
 * For example, between today and yesterday, the `window` is today, the
 * `overlap` is the hours of yesterday in the last 24 hours, and the `prior` is
 * yesterday before the last 24 hours.
 * Can apply to time periods other than previous days, e.g. weeks, months or
 * years.
 */
export type TemporalRelativeCategory = 
  | 'older' // Before the previous time period.
  | 'prior' // In the previous time period before the last time period.
  | 'overlap' // Within the previous time period and the last time period.
  | 'window' // The current time period.
;

/**
 * This type expresses a time period such as a day or 24 hour period or a week.
 */
export type TemporalPeriod<K extends PropertyKey> = {
  category: TemporalRelativeCategory;
  /**
   * E.g. beginning of the month/week/day
   * Calculating the other properties means we already have this data.
   */
  start: Temporal.ZonedDateTime;
  /**
   * The end date time would be the last second of the period in question, but
   * we haven't already calculated it and there is no precendent for its utility
   * yet, so it hasn't been made a requirement for the type.
   * E.g. end of the month/week/day
   */
  // end: Temporal.ZonedDateTime;
  /**
   * The month/week/day as a property of the start (and would apply to the end
   * as well).
   * @todo Ideally this would be limited to a key with a numeric type.
   */
  key: K;
  /**
   * This is the numeric value relevant to this period, whatever that value may
   * express. One example would be frequencies of occurrence in that period,
   * such as git commits for the week or diary entries for the day.
   */
  value: number;
};

/**
 * This type is for aggregating frequencies of occurrence for data at a specific
 * level of granularity, e.g. the year broken down by months, month by days,
 * etc...
 */
export type TemporalGranularityFrequencies<Granularity extends TemporalGranularity> = {
  granularity: Granularity;
  breakdownKey: keyof Temporal.ZonedDateTime;
  priorThreshold: Temporal.ZonedDateTime;
  size: number; // Because we already have it.
  from: Temporal.ZonedDateTime; // Because we already have it.
  // to: Temporal.ZonedDateTime; // If we need it.
  frequencies: {
    [K: number]: TemporalPeriod<typeof K>;
  };
  summary: {
    // Is "last" if we have no zero-frequency entries for both overlap AND window
    // Is "full" if we have the same for "prior".
    // Otherwise "insufficient".
    populated: 'full' | 'last' | 'insufficient';
  };
};

/**
 * For multiple temporal frequencies.
 */
export type TemporalFrequencies = {
  [
    Granularity in TemporalGranularity
  ]: TemporalGranularityFrequencies<Granularity>;
};
