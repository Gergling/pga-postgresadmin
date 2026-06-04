import { describe, it, expect } from 'vitest';
import { Temporal } from "@js-temporal/polyfill";
import { 
  recencyFactory, 
  reduceSummaryPopulatedStatus, 
  reduceTemporalFrequenciesFactory, 
  reduceTemporalGranularitySummary 
} from './factory';
import { generateConfig, generateZeroFrequencies, getFrequencyKey } from './frequencies';
import { TemporalGranularity } from '../config';
import { TemporalPeriod } from '../schema';

describe('factory', () => {
  const now = Temporal.ZonedDateTime.from('2024-05-20T12:00:00[UTC]');
  const base = generateZeroFrequencies(now);

  describe('reduceTemporalFrequenciesFactory', () => {
    it('should increment value when starting from zero', () => {
      // Arrange
      const date = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
      const reducer = reduceTemporalFrequenciesFactory(date);
      const acc = { ...base };

      // Act
      const result = reducer(acc, 'days');

      // Assert
      const key = getFrequencyKey(base.days.quantise(date));
      expect(result.days.frequencies[key].value).toBe(1);
    });

    it('should correctly aggregate multiple increments in the accumulator', () => {
      // Arrange
      const date = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
      const reducer = reduceTemporalFrequenciesFactory(date);
      
      // First pass
      const step1 = reducer(base, 'days');
      // Second pass
      const step2 = reducer(step1, 'days');

      // Assert
      const key = getFrequencyKey(base.days.quantise(date));
      expect(step2.days.frequencies[key].value).toBe(2);
    });

    it('should maintain existing frequency values for other keys', () => {
      // Arrange
      const date = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
      const key = getFrequencyKey(base.days.quantise(date));
      
      const existingAcc = {
        days: {
          ...base.days,
          frequencies: {
            ...base.days.frequencies, // Key 'key' has value 0 here
            'other-key': { ...base.days.frequencies[key], value: 10 }
          }
        }
      };

      const reducer = reduceTemporalFrequenciesFactory(date);

      // Act
      const result = reducer(existingAcc as any, 'days');

      // Assert
      expect(result.days.frequencies[key].value).toBe(1);
      expect(result.days.frequencies['other-key'].value).toBe(10);
    });
  });

  describe('reduceSummaryPopulatedStatus', () => {
    it('should return "full" if the value is non-zero', () => {
      const period: Partial<TemporalPeriod> = { category: 'window', value: 5 };
      expect(reduceSummaryPopulatedStatus('full', period as TemporalPeriod)).toBe('full');
    });

    it('should downgrade to "last" if a "prior" category has zero value', () => {
      const period: Partial<TemporalPeriod> = { category: 'prior', value: 0 };
      expect(reduceSummaryPopulatedStatus('full', period as TemporalPeriod)).toBe('last');
    });

    it('should downgrade to "insufficient" if a "window" category has zero value', () => {
      const period: Partial<TemporalPeriod> = { category: 'window', value: 0 };
      expect(reduceSummaryPopulatedStatus('full', period as TemporalPeriod)).toBe('insufficient');
    });

    it('should stay "insufficient" once that state is reached', () => {
      const period: Partial<TemporalPeriod> = { category: 'window', value: 10 };
      expect(reduceSummaryPopulatedStatus('insufficient', period as TemporalPeriod)).toBe('insufficient');
    });
  });

  describe('reduceTemporalGranularitySummary', () => {
    it('should update the population status for a granularity level', () => {
      // Arrange: create an acc where one 'window' bucket is 0
      // const date = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
      const acc = { ...base };
      // const key = getFrequencyKey(base.days.quantise(date));
      
      // Ensure everything is 0 (insufficient)
      const resultInsufficient = reduceTemporalGranularitySummary(acc, 'days');
      expect(resultInsufficient.days.summary.populated).toBe('insufficient');

      // Fill all buckets manually to test 'full'
      const fullFrequencies = { ...acc.days.frequencies };
      Object.keys(fullFrequencies).forEach(k => {
        fullFrequencies[k] = { ...fullFrequencies[k], value: 1 };
      });
      acc.days.frequencies = fullFrequencies;

      const resultFull = reduceTemporalGranularitySummary(acc, 'days');
      expect(resultFull.days.summary.populated).toBe('full');
    });
  });

  describe('recencyFactory', () => {
    it(
      'should return initial base frequencies when no dates provided',
      () => {
        // Arrange
        const config = generateConfig(now);
        const base = generateZeroFrequencies(now);

        Object.keys(config).forEach(granularityStr => {
          const granularity = granularityStr as TemporalGranularity;
          const expectation = base[granularity];
          console.log(expectation.frequencies)
          const factory = recencyFactory(now);
  
          // Act
          const result = factory.getTemporalFrequencies([]);
          
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
        });
    });

    it('should calculate frequencies for provided dates', () => {
      const factory = recencyFactory(now);
      const date1 = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
      const date2 = Temporal.ZonedDateTime.from('2024-05-19T10:00:00[UTC]');
      
      const result = factory.getTemporalFrequencies([date1, date1, date2]);

      const key1 = getFrequencyKey(base.days.quantise(date1));
      const key2 = getFrequencyKey(base.days.quantise(date2));

      // two occurrences of date1 should result in value 2
      expect(result.days.frequencies[key1].value).toBe(2);
      expect(result.days.frequencies[key2].value).toBe(1);
    });

    it('should determine "insufficient" population status when window/overlap buckets are empty', () => {
      const factory = recencyFactory(now);
      const date = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
      const result = factory.getTemporalFrequencies([date]);
      
      // For 'days', there are 24 hours. Only one is filled, leaving empty window/overlap buckets.
      expect(result.days.summary.populated).toBe('insufficient');
    });
  });
});