import { describe, it, expect } from 'vitest';
import { Temporal } from "@js-temporal/polyfill";
import {
  getFrequencyKey,
  generateConfig,
  reduceZeroTemporalGranularityConfigFactory,
  reduceFrequencyFactory,
} from './frequencies';
import {
  TemporalFrequencies,
  TemporalGranularity,
  TemporalGranularityFrequencies
} from '../schema';
import { mockNow, mockTemporalFrequencies } from './frequencies.test-data';

describe('frequencies', () => {
  const now = mockNow;

  describe('getFrequencyKey', () => {
    it('should format a ZonedDateTime into a YYYY-MM-DDTHH:mm:ss string', () => {
      const date = Temporal.ZonedDateTime.from('2024-05-20T12:30:45[UTC]');
      const result = getFrequencyKey(date);
      expect(result).toBe('2024-05-20T12:30:45');
    });

    it('should pad single-digit months, days, and time components with leading zeros', () => {
      const date = Temporal.ZonedDateTime.from('2024-01-05T09:08:07[UTC]');
      const result = getFrequencyKey(date);
      expect(result).toBe('2024-01-05T09:08:07');
    });

    it('should correctly handle the transition to midnight', () => {
      const date = Temporal.ZonedDateTime.from('2024-12-31T00:00:00[UTC]');
      const result = getFrequencyKey(date);
      expect(result).toBe('2024-12-31T00:00:00');
    });
  });

  describe('reduceFrequencyFactory', () => {
    it('should correctly calculate start times and accumulate parsed temporal periods', () => {
      // Arrange
      const now = Temporal.ZonedDateTime.from('2026-06-02T12:00:00[Europe/London]');
      const priorThreshold = Temporal.ZonedDateTime.from('2026-06-01T00:00:00[Europe/London]');
      const current = Temporal.ZonedDateTime.from('2026-06-02T00:00:00[Europe/London]');
      const from = Temporal.ZonedDateTime.from('2026-05-30T00:00:00[Europe/London]');
      const durationKey = 'days';

      const reducer = reduceFrequencyFactory(
        now,
        priorThreshold,
        current,
        from,
        durationKey
      );

      const initialAccumulator = {} as TemporalGranularityFrequencies<'days'>['frequencies'];
      const key = 'day_2';
      const index = 2; // Adding 2 days to 'from' (2026-05-30) results in 2026-06-01

      // Act
      const result = reducer(initialAccumulator, key, index);

      // Assert
      const expectedStart = from.add({ [durationKey]: index });

      // Verify accumulator output structure
      expect(result).toEqual({
        [key]: {
          category: 'overlap',
          key,
          start: expectedStart,
          value: 0,
        },
      });
    });
  });

  describe('generateConfig', () => {
    it('should return correct boundary dates for a Wednesday reference date', () => {
      // now is 2024-05-22T12:00:00 (A Wednesday)
      const config = generateConfig(now);

      // Days: from is yesterday, current is start of today
      expect(config.days.from.toString()).toBe('2024-05-21T00:00:00+00:00[UTC]');
      expect(config.days.current.toString()).toBe('2024-05-22T00:00:00+00:00[UTC]');

      // Weeks: current is start of this week (Monday), from is last week (Monday)
      expect(config.weeks.from.toString()).toBe('2024-05-13T00:00:00+00:00[UTC]');
      expect(config.weeks.current.toString()).toBe('2024-05-20T00:00:00+00:00[UTC]');

      // Months: current is start of May, from is start of April
      expect(config.months.from.toString()).toBe('2024-04-01T00:00:00+00:00[UTC]');
      expect(config.months.current.toString()).toBe('2024-05-01T00:00:00+00:00[UTC]');

      // Years: current is start of 2024, from is start of 2023
      expect(config.years.from.toString()).toBe('2023-01-01T00:00:00+00:00[UTC]');
      expect(config.years.current.toString()).toBe('2024-01-01T00:00:00+00:00[UTC]');
    });

    describe('granularity handlers', () => {
      const config = generateConfig(now);
      const midMonthDate = Temporal.ZonedDateTime.from('2024-05-15T10:30:45[UTC]');

      it('years should reset to start of year and increment by month', () => {
        expect(config.years.quantise(midMonthDate).toString()).toBe('2024-01-01T00:00:00+00:00[UTC]');
        expect(config.years.increment(midMonthDate).month).toBe(6);
      });

      it('months should reset to start of month and increment by day', () => {
        expect(config.months.quantise(midMonthDate).toString()).toBe('2024-05-01T00:00:00+00:00[UTC]');
        expect(config.months.increment(midMonthDate).day).toBe(16);
      });

      it('weeks should reset to start of week (Monday) and increment by day', () => {
        // May 15, 2024 was a Wednesday
        expect(config.weeks.quantise(midMonthDate).toString()).toBe('2024-05-13T00:00:00+00:00[UTC]');
        expect(config.weeks.increment(midMonthDate).day).toBe(16);
      });

      it('days should reset to start of hour and increment by hour', () => {
        const resetDate = config.days.quantise(midMonthDate);
        expect(resetDate.hour).toBe(10);
        expect(resetDate.minute).toBe(0);
        expect(resetDate.second).toBe(0);
        expect(config.days.increment(midMonthDate).hour).toBe(11);
      });
    });

    it('should correctly calculate week boundaries when "now" is a Sunday', () => {
      const sunday = Temporal.ZonedDateTime.from('2024-05-26T12:00:00[UTC]');
      const config = generateConfig(sunday);

      // currentWeek should still be Monday May 20
      expect(config.weeks.current.toString()).toBe('2024-05-20T00:00:00+00:00[UTC]');
      expect(config.weeks.from.toString()).toBe('2024-05-13T00:00:00+00:00[UTC]');
    });

    it('should handle leap year transitions in month config', () => {
      const march1st = Temporal.ZonedDateTime.from('2024-03-01T12:00:00[UTC]');
      const config = generateConfig(march1st);

      // From should be Feb 1st
      expect(config.months.from.month).toBe(2);
      expect(config.months.from.daysInMonth).toBe(29); // 2024 is a leap year
    });
  });

  describe('reduceZeroTemporalGranularityConfigFactory', () => {
    const config = generateConfig(now);
    const factory = reduceZeroTemporalGranularityConfigFactory(now);

    it.each(Object.entries(config))(
      'should correctly initialize frequencies for a granularity of %s with default values',
      (granularityStr, item) => {
        // Arrange
        const granularity = granularityStr as TemporalGranularity;
        const expectation = mockTemporalFrequencies[granularity];
        const initialAcc = {} as TemporalFrequencies;

        // Act
        const result = factory(initialAcc, { granularity, item });

        // Assert
        expect(result).toHaveProperty(granularity);
        const granularResult = result[granularity];

        expect(granularResult.breakdownKey).toBe(expectation.breakdownKey);
        expect(granularResult.current).toEqual(expectation.current);
        expect(granularResult.from).toEqual(expectation.from);
        expect(granularResult.granularity).toBe(granularity);
        expect(granularResult.priorThreshold).toEqual(expectation.priorThreshold);
        expect(granularResult.summary.populated).toBe('insufficient');
        expect(granularResult.frequencies).toEqual(expectation.frequencies);
      }
    );
  });
});
