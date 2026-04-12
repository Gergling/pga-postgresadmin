import { Temporal } from "@js-temporal/polyfill";
import { TemporalGranularity } from "../config";
import { TemporalRelativeCategory } from "../types";

export const getTemporalRelativeCategory = (
  date: Temporal.ZonedDateTime,
  since: Temporal.Duration,
  granularity: TemporalGranularity,
  prior: Temporal.ZonedDateTime
): TemporalRelativeCategory => {
  if (since[granularity] === 0) return 'window';
  if (
    prior.epochMilliseconds > date.epochMilliseconds
  ) return 'overlap';
  // TODO: Needs to handle where since[granularity] > 1, as that will be
  // "older".
  return 'prior';
};
