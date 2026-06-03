import { Temporal } from "@js-temporal/polyfill";
import { TemporalGranularity } from "../config";
import { getTemporalRelativeCategory } from "./category";
import {
  TemporalFrequencies,
  TemporalGranularityConfig,
  TemporalGranularityConfigItem,
  TemporalGranularityFrequencies,
  temporalGranularityParse,
  temporalPeriodSchema
} from "../schema";

const BASE_RESET_KEYS: (keyof Temporal.ZonedDateTime)[] = [
  'minute', 'second', 'millisecond', 'microsecond', 'nanosecond'
];

export const getFrequencyKey = ({
  year, month, day, hour, minute, second
}: Temporal.ZonedDateTime): string => {
  const [dMonth, dDay, ...time] = [month, day, hour, minute, second].map(
    (value) => `${value}`.padStart(2, '0'),
  );
  return `${year}-${dMonth}-${dDay}T${time.join(':')}`
};

export const reduceFrequencyFactory = <T extends TemporalGranularity>(
  now: Temporal.ZonedDateTime,
  priorThreshold: Temporal.ZonedDateTime,
  current: Temporal.ZonedDateTime,
  from: Temporal.ZonedDateTime,
  durationKey: keyof Temporal.Duration,
) => (acc: TemporalGranularityFrequencies<T>['frequencies'], key: string, i: number) => {
  const start = from.add({ [durationKey]: i });
  const category = getTemporalRelativeCategory(start, {
    prior: from,
    overlap: priorThreshold,
    window: current,
    now,
  });
  return {
    ...acc,
    [key]: temporalPeriodSchema.parse({ category, start, key }),
  };
}

export const reduceZeroTemporalGranularityConfigFactory = (
  now: Temporal.ZonedDateTime,
) => (
  acc: TemporalFrequencies, {
    granularity, item: {
      breakdownKey, current, from, sizeKey, durationKey, quantise
    }
  }: {
    granularity: TemporalGranularity;
    item: TemporalGranularityConfigItem;
  }
): TemporalFrequencies => {
  const since = now.since(from, { largestUnit: durationKey as keyof Temporal.DurationLike });
  // TODO: Get rid of size as it can be variable at the monthly level.
  const size = from[sizeKey] as number;
  const length = since[durationKey] as number;
  const priorThreshold = now.subtract({ [granularity]: 1 });
  const quantised = quantise(from);
  const keys = Array.from({
    length: length + 1
  }, (_, i) => getFrequencyKey(quantised.add({ [durationKey]: i })));
  const frequencies = keys.reduce(
    reduceFrequencyFactory<typeof granularity>(now, priorThreshold, current, from, durationKey),
    {} as TemporalGranularityFrequencies<typeof granularity>['frequencies']
  );
  return {
    ...acc,
    [granularity]: {
      breakdownKey,
      current,
      from,
      frequencies,
      granularity,
      priorThreshold,
      quantise,
      size,
      summary: {
        populated: 'insufficient',
      },
    },
  };
};

export const generateConfig = (
  now = Temporal.Now.zonedDateTimeISO()
): TemporalGranularityConfig => {
  const currentDay = now.startOfDay();
  const previousDay = currentDay.subtract({ days: 1 });
  const currentWeek = currentDay.subtract({ days: now.dayOfWeek - 1 });
  const previousWeek = currentDay.subtract({ days: now.dayOfWeek + 6 });
  const currentMonth = currentDay.with({ day: 1 });
  const previousMonth = currentMonth.subtract({ months: 1 });
  const currentYear = currentMonth.with({ month: 1 });
  const previousYear = currentYear.subtract({ years: 1 });

  return temporalGranularityParse({
    years: {
      current: currentYear, from: previousYear, 
      quantise: (date) => date.startOfDay().with({ month: 1, day: 1 }),
      increment: (date) => date.add({ months: 1 }),
    },
    months: {
      current: currentMonth, from: previousMonth,
      quantise: (date) => date.startOfDay().with({ day: 1 }),
      increment: (date) => date.add({ days: 1 }),
    },
    weeks: {
      from: previousWeek,
      current: currentWeek,
      quantise: (date) => date.startOfDay().subtract({ days: date.dayOfWeek - 1 }),
      increment: (date) => date.add({ days: 1 }),
    },
    days: {
      current: currentDay, from: previousDay,
      quantise: (date) => BASE_RESET_KEYS.reduce(
        (date, key) => date.with({ [key]: 0 }), date
      ),
      increment: (date) => date.add({ hours: 1 }),
    },
  });
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
  const map = generateConfig(now);

  return Object.entries(map).map(([
    granularityStr, item
  ]) => ({ granularity: granularityStr as TemporalGranularity, item })).reduce(
    reduceZeroTemporalGranularityConfigFactory(now),
    {} as TemporalFrequencies
  );
};
