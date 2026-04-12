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
  const currentDay = now.with({ hour: 0, minute: 0, second: 0 });
  const previousDay = currentDay.with({ day: now.day - 1 });
  const currentWeek = currentDay.subtract({ days: now.dayOfWeek - 1 });
  const previousWeek = currentDay.subtract({ days: now.dayOfWeek + 6 });
  const currentMonth = currentDay.with({ day: 1 });
  const previousMonth = currentMonth.subtract({ months: 1 });
  const currentYear = currentMonth.with({ month: 1 });
  const previousYear = currentYear.subtract({ years: 1 });

  const map: Record<TemporalGranularity, {
    from: Temporal.ZonedDateTime;
    current: Temporal.ZonedDateTime;
    incrementKey: keyof Temporal.ZonedDateTime;
    sizeKey: keyof Temporal.ZonedDateTime;
  }> = {
    years: {
      from: previousYear, incrementKey: 'month', sizeKey: 'monthsInYear',
      current: currentYear,
    },
    months: {
      from: previousMonth, incrementKey: 'day', sizeKey: 'daysInMonth',
      current: currentMonth,
    },
    weeks: {
      from: previousWeek, incrementKey: 'dayOfWeek', sizeKey: 'daysInWeek',
      current: currentWeek,
    },
    days: {
      from: previousDay, incrementKey: 'hour', sizeKey: 'hoursInDay',
      current: currentDay,
    },
  };

  return Object.entries(map).reduce((acc, [
    granularityStr, { current, from, incrementKey, sizeKey }
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
        start, priorThreshold, since, granularity, current, now
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
        current,
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
