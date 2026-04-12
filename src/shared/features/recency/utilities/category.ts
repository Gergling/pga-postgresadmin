import { Temporal } from "@js-temporal/polyfill";
import { TemporalGranularity } from "../config";
import { TemporalRelativeCategory } from "../types";

/**
 * Let's take a series of dates in chronological order:
 |-----------------------------------------------------------------
 | Before Yesterday
 |---Prior-Threshold-----------------------------------------------
 | Prior: Yesterday but before 24h ago (before `since` starts).
 |---Overlap-Threshold---------------------------------------------
 | Overlap: Yesterday but less than 24h ago (after `since` starts).
 |---Window-Threshold----------------------------------------------
 | Window: Today up to now.
 |---Now-----------------------------------------------------------
 | Future: After now.
 |-----------------------------------------------------------------
 * We are trying to figure out where the date sits in this categorisation of
 * time periods.
 * @param date The date (and time) to be categorised.
 * @param since The duration passed between now and the time period for the
 * granularity.
 * @param granularity The duration property we're using for reference.
 * @param prior The threshold that 
 * @returns 
 */

export const getTemporalRelativeCategory = (
  date: Temporal.ZonedDateTime,
  prior: Temporal.ZonedDateTime,
  since: Temporal.Duration,
  granularity: TemporalGranularity,
  window: Temporal.ZonedDateTime,
  now?: Temporal.ZonedDateTime
): TemporalRelativeCategory => {
  if (prior.epochMilliseconds < date.epochMilliseconds) return 'older';
  if (now && now.epochMilliseconds < date.epochMilliseconds) return 'future';
  if (since[granularity] > 0) return 'prior';
  if (window.epochMilliseconds < date.epochMilliseconds) return 'window';
  return 'overlap';
};
