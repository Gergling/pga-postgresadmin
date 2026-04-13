import { Temporal } from "@js-temporal/polyfill";
import { TemporalGranularity } from "../config";
import { TemporalFrequencies, TemporalGranularityFrequencies } from "../types";
import { getTemporalRelativeCategory } from "./category";

const BASE_RESET_KEYS: (keyof Temporal.ZonedDateTime)[] = [
  'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'
];

export const getFrequencyKey = ({
  year, month, day, hour, minute, second
}: Temporal.ZonedDateTime) => {
  const [dMonth, dDay, ...time] = [month, day, hour, minute, second].map(
    (value) => `${value}`.padStart(2, '0'),
  );
  return `${year}-${dMonth}-${dDay}T${time.join(':')}`
};

/**
 * Dates dependent on date's daily distributions derive divisions directly.
 * @param now Is either now, or the time before which the occurrence frequencies
 * should be taken from.
 * @returns "Empty" frequencies at every granularity.
 */
export const generateZeroFrequencies = (
  now = Temporal.Now.zonedDateTimeISO()
): TemporalFrequencies => {
  const currentDay = now.startOfDay();
  const previousDay = currentDay.subtract({ days: 1 });
  const currentWeek = currentDay.subtract({ days: now.dayOfWeek - 1 });
  const previousWeek = currentDay.subtract({ days: now.dayOfWeek + 6 });
  const currentMonth = currentDay.with({ day: 1 });
  const previousMonth = currentMonth.subtract({ months: 1 });
  const currentYear = currentMonth.with({ month: 1 });
  const previousYear = currentYear.subtract({ years: 1 });

  const map: Record<TemporalGranularity, {
    from: Temporal.ZonedDateTime;
    increment: (date: Temporal.ZonedDateTime) => Temporal.ZonedDateTime;
    current: Temporal.ZonedDateTime;
    incrementKey: keyof Temporal.ZonedDateTime;
    durationKey: keyof Temporal.Duration;
    sizeKey: keyof Temporal.ZonedDateTime;
    // Should be called "quantise" or something.
    reset: (date: Temporal.ZonedDateTime) => Temporal.ZonedDateTime;
  }> = {
    years: {
      from: previousYear, incrementKey: 'month', sizeKey: 'monthsInYear',
      current: currentYear, durationKey: 'months',
      reset: (date) => date.startOfDay().with({ month: 1, day: 1 }),
      increment: (date) => date.add({ months: 1 }),
    },
    months: {
      from: previousMonth, incrementKey: 'day', sizeKey: 'daysInMonth',
      current: currentMonth, durationKey: 'days',
      reset: (date) => date.startOfDay().with({ day: 1 }),
      increment: (date) => date.add({ days: 1 }),
    },
    weeks: {
      from: previousWeek, incrementKey: 'dayOfWeek', sizeKey: 'daysInWeek',
      current: currentWeek, durationKey: 'days',
      reset: (date) => date.startOfDay().subtract({ days: date.dayOfWeek - 1 }),
      increment: (date) => date.add({ days: 1 }),
    },
    days: {
      from: previousDay, incrementKey: 'hour', sizeKey: 'hoursInDay',
      current: currentDay, durationKey: 'hours',
      reset: (date) => BASE_RESET_KEYS.reduce(
        (date, key) => date.with({ [key]: 0 }), date
      ),
      increment: (date) => date.add({ hours: 1 }),
    },
  };

  return Object.entries(map).reduce((acc, [
    granularityStr, {
      current, from, incrementKey, sizeKey, durationKey, reset
    }
  ]) => {
    const granularity = granularityStr as TemporalGranularity;
    const breakdownKey = incrementKey;
    const since = now.since(from);
    const to = reset(now);
    const size = from[sizeKey] as number;
    const length = since[durationKey] as number;
    const priorThreshold = now.subtract({ [granularity]: 1 });
    const keys = Array.from({
      length
    }, (_, i) => getFrequencyKey(reset(from).add({ [durationKey]: i })));
    const frequencies = keys.reduce((acc, key, i) => {
      const start = from.add({ [durationKey]: i });
      const category = getTemporalRelativeCategory(start, {
        prior: from,
        overlap: priorThreshold,
        window: current,
        now,
      });
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
        from,
        frequencies,
        granularity,
        priorThreshold,
        reset,
        size,
        summary: {
          populated: 'insufficient',
        },
      },
    };
  }, {} as TemporalFrequencies);
};
