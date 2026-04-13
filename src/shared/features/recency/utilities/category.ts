import { Temporal } from "@js-temporal/polyfill";
import { TemporalGranularity } from "../config";
import { TemporalRelativeCategory } from "../types";

export const getTemporalRelativeSinceOverlap = (
  granularity: TemporalGranularity,
  now: Temporal.ZonedDateTime
): Temporal.Duration => now.since({ [granularity]: 1 });
export const getTemporalRelativeOverlapThreshold = (
  duration: Temporal.Duration,
  now: Temporal.ZonedDateTime
): Temporal.ZonedDateTime => now.subtract(duration);

/**
 * Let's take a series of dates in chronological order:
 |-----------------------------------------------------------------
 | Older: Before Yesterday
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
 * @param prior The threshold at the beginning of the previous time period.
 * @returns 
 */

export const getTemporalRelativeCategory = (
  date: Temporal.ZonedDateTime,
  { prior, overlap, window, now }: {
    prior: Temporal.ZonedDateTime,
    overlap: Temporal.ZonedDateTime,
    window: Temporal.ZonedDateTime,
    now: Temporal.ZonedDateTime,
  }
): TemporalRelativeCategory => {
  const ms = date.epochMilliseconds;
  if (ms > now.epochMilliseconds) return 'future';
  if (ms > window.epochMilliseconds) return 'window';
  if (ms > overlap.epochMilliseconds) return 'overlap';
  if (ms > prior.epochMilliseconds) return 'prior';
  return 'older';
};
