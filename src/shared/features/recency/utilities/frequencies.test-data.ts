import { Temporal } from "@js-temporal/polyfill";
import { TemporalFrequencies, TemporalRelativeCategory } from "../schema";

// Our "now" is 20th May at midday.
export const mockNow = Temporal.ZonedDateTime.from('2024-05-22T11:00:00[UTC]');

const getMockFrequencies = (
  length: number,
  getKey: (i: number) => string,
  category: TemporalRelativeCategory
) => Array.from(
  { length }, (_, i) => {
    const key = getKey(i);
    const start = Temporal.ZonedDateTime.from(`${key}[UTC]`);
    return { category, key, start, value: 0 };
  }
).reduce((acc, item) => ({ ...acc, [item.key]: item }), {});

const pad = (value: number) => value.toString().padStart(2, '0');

export const mockTemporalFrequencies: TemporalFrequencies = {
  // Aggregates dates against last year and this year on a monthly level.
  years: {
    // What we're breaking the time period down into. For years, it is months.
    breakdownKey: 'month',
    granularity: 'years',
    // The current period is January 1st 2024.
    current: Temporal.ZonedDateTime.from('2024-01-01T00:00:00[UTC]'),
    // The previous period is January 1st 2023.
    from: Temporal.ZonedDateTime.from('2023-01-01T00:00:00[UTC]'),
    // This is where the "prior" category becomes "overlap". In this case, "now", but exactly 1 year ago.
    priorThreshold: Temporal.ZonedDateTime.from('2023-05-20T11:00:00[UTC]'),
    size: 12,
    quantise: (date) => date.startOfDay().with({ month: 1, day: 1 }),
    summary: {
      populated: 'insufficient',
    },
    frequencies: {
      // Prior is 2023 up to May.
      ...getMockFrequencies(
        5, (i) => `2023-${pad(i + 1)}-01T00:00:00`,
        'prior'
      ),
      // Overlap is from May 2023.
      ...getMockFrequencies(
        7, (i) => `2023-${pad(i + 6)}-01T00:00:00`,
        'overlap'
      ),
      // Window is 2024 up to May.
      ...getMockFrequencies(
        5, (i) => `2024-${pad(i + 1)}-01T00:00:00`,
        'window'
      ),
    },
  },
  months: {
    breakdownKey: 'day',
    granularity: 'months',
    current: Temporal.ZonedDateTime.from('2024-05-01T00:00:00[UTC]'),
    from: Temporal.ZonedDateTime.from('2024-04-01T00:00:00[UTC]'),
    priorThreshold: Temporal.ZonedDateTime.from('2024-04-20T11:00:00[UTC]'),
    // TODO: Months have different sizes.
    size: 31,
    quantise: (date) => date.startOfDay().with({ day: 1 }),
    summary: { populated: 'insufficient' },
    frequencies: {
      // Prior is April 2024 up to 20th.
      ...getMockFrequencies(
        22, (i) => `2024-04-${pad(i + 1)}T00:00:00`,
        'prior'
      ),
      // Overlap is from 20th to 30th April 2024
      ...getMockFrequencies(
        8, (i) => `2024-04-${pad(i + 23)}T00:00:00`,
        'overlap'
      ),
      // Window is May up to 20th.
      ...getMockFrequencies(
        22, (i) => `2024-05-${pad(i + 1)}T00:00:00`,
        'window'
      ),
    },
  },
  weeks: {
    breakdownKey: 'dayOfWeek',
    granularity: 'weeks',
    current: Temporal.ZonedDateTime.from('2024-05-20T00:00:00[UTC]'),
    from: Temporal.ZonedDateTime.from('2024-05-13T00:00:00[UTC]'),
    priorThreshold: Temporal.ZonedDateTime.from('2024-05-15T11:00:00[UTC]'),
    size: 7,
    summary: { populated: 'insufficient' },
    quantise: (date) => date.startOfDay().subtract({ days: date.dayOfWeek - 1 }),
    frequencies: {
      // Prior is 13th April 2024 to 15th May 2024.
      ...getMockFrequencies(
        3, (i) => `2024-05-${pad(i + 13)}T00:00:00`,
        'prior'
      ),
      // Overlap is 15th to 20th May 2024.
      ...getMockFrequencies(
        4, (i) => `2024-05-${pad(i + 16)}T00:00:00`,
        'overlap'
      ),
      // Window is May up to 20th.
      ...getMockFrequencies(
        3, (i) => `2024-05-${pad(i + 20)}T00:00:00`,
        'window'
      ),
    },
  },
  days: {
    breakdownKey: 'hour',
    granularity: 'days',
    current: Temporal.ZonedDateTime.from('2024-05-22T00:00:00[UTC]'),
    from: Temporal.ZonedDateTime.from('2024-05-21T00:00:00[UTC]'),
    priorThreshold: Temporal.ZonedDateTime.from('2024-05-21T11:00:00[UTC]'),
    size: 24,
    summary: { populated: 'insufficient' },
    quantise: (date) => date.with({
      minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0
    }),
    frequencies: {
      // Prior is May 21st until 11am.
      ...getMockFrequencies(
        11, (i) => `2024-05-21T${pad(i)}:00:00`,
        'prior'
      ),
      // Overlap is May 21st from 11am
      ...getMockFrequencies(
        13, (i) => `2024-05-21T${pad(i + 11)}:00:00`,
        'overlap'
      ),
      // Window is May 22nd until 11am.
      ...getMockFrequencies(
        12, (i) => `2024-05-22T${pad(i)}:00:00`,
        'window'
      ),
    },
  },
};
