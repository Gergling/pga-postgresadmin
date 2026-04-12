import { Temporal } from "@js-temporal/polyfill";
import { TemporalGranularity } from "../config";
import { TemporalFrequencies, TemporalGranularityFrequencies } from "../types";
import { getTemporalRelativeCategory } from "./category";

/**
 * Dates dependent on date's daily distributions derive divisions directly.
 * @param now Is either now, or the time before which the occurrence frequencies
 * should be taken from.
 * @returns "Empty" frequencies at every granularity.
 */
export const generateZeroFrequencies = (
  now = Temporal.Now.zonedDateTimeISO()
): TemporalFrequencies => {
  const reset = now.with({ hour: 0, minute: 0, second: 0 });
  const previousDay = reset.with({ day: now.day - 1 });
  const previousWeek = reset.subtract({ days: now.dayOfWeek + 6 });
  const previousMonth = reset.with({ day: 1 }).subtract({ months: 1 });
  const previousYear = reset.with({ day: 1, month: 1 }).subtract({ years: 1 });

  const map: Record<TemporalGranularity, {
    from: Temporal.ZonedDateTime;
    incrementKey: keyof Temporal.ZonedDateTime;
    sizeKey: keyof Temporal.ZonedDateTime;
  }> = {
    years: { from: previousYear, incrementKey: 'month', sizeKey: 'monthsInYear' },
    months: { from: previousMonth, incrementKey: 'day', sizeKey: 'daysInMonth' },
    weeks: { from: previousWeek, incrementKey: 'dayOfWeek', sizeKey: 'daysInWeek' },
    days: { from: previousDay, incrementKey: 'hour', sizeKey: 'hoursInDay' },
  };

  return Object.entries(map).reduce((acc, [
    granularityStr, { from, incrementKey, sizeKey }
  ]) => {
    const granularity = granularityStr as TemporalGranularity;
    const breakdownKey = incrementKey
    const size = from[sizeKey] as number;
    const priorThreshold = now.subtract({ [granularity]: 1 });
    const keys = Array.from({ length: size }, (_, i) => i + 1);
    const frequencies = keys.reduce((acc, key) => {
      const start = from.with({ [incrementKey]: key });
      const since = now.since(start);
      const category = getTemporalRelativeCategory(
        start, since, granularity, priorThreshold
      );
      return {
        ...acc,
        [key]: { category, start, key, value: 0 }
      };
    }, {} as TemporalGranularityFrequencies<typeof granularity>);
    return {
      ...acc,
      [granularity]: {
        breakdownKey,
        granularity,
        priorThreshold,
        size,
        from,
        frequencies,
        summary: {
          populated: 'insufficient',
        },
      },
    };
  }, {} as TemporalFrequencies);
};
