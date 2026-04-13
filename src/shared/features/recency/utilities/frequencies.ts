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
  const currentDay = now.with({ hour: 0, minute: 0, second: 0 });
  const previousDay = currentDay.subtract({ days: 1 });
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
    durationKey: keyof Temporal.Duration;
    sizeKey: keyof Temporal.ZonedDateTime;
    resetKeys: (keyof Temporal.ZonedDateTime)[];
  }> = {
    years: {
      from: previousYear, incrementKey: 'month', sizeKey: 'monthsInYear',
      current: currentYear, durationKey: 'months', resetKeys: [
        ...BASE_RESET_KEYS, 'month', 'day', 'hour'
      ],
    },
    months: {
      from: previousMonth, incrementKey: 'day', sizeKey: 'daysInMonth',
      current: currentMonth, durationKey: 'days', resetKeys: [
        ...BASE_RESET_KEYS, 'day', 'hour'
      ],
    },
    weeks: {
      from: previousWeek, incrementKey: 'dayOfWeek', sizeKey: 'daysInWeek',
      current: currentWeek, durationKey: 'days', resetKeys: [
        ...BASE_RESET_KEYS, 'hour'
      ],
    },
    days: {
      from: previousDay, incrementKey: 'hour', sizeKey: 'hoursInDay',
      current: currentDay, durationKey: 'hours', resetKeys: BASE_RESET_KEYS
    },
  };

  return Object.entries(map).reduce((acc, [
    granularityStr, { current, from, incrementKey, sizeKey, durationKey }
  ]) => {
    const granularity = granularityStr as TemporalGranularity;
    const breakdownKey = incrementKey;
    const size = from[sizeKey] as number;
    const priorThreshold = now.subtract({ [granularity]: 1 });
    const keys = Array.from({
      length: size
    }, (_, i) => getFrequencyKey(from.add({ [durationKey]: i })));
    const frequencies = keys.reduce((acc, key, i) => {
      const start = from.add({ [durationKey]: i });
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
