import { Temporal } from "@js-temporal/polyfill";
import { describe, it, expect } from 'vitest';
import { getFrequencyKey, generateZeroFrequencies } from './frequencies';

describe('frequencies', () => {
  describe('getFrequencyKey', () => {
    it('should format a date correctly with zero-padding', () => {
      // Arrange
      const dt = Temporal.ZonedDateTime.from('2024-05-05T09:05:01[UTC]');
      
      // Act
      const result = getFrequencyKey(dt);
      
      // Assert
      expect(result).toBe('2024-05-05T09:05:01');
    });

    it('should handle dates with double-digit components correctly', () => {
      // Arrange
      const dt = Temporal.ZonedDateTime.from('2024-12-25T23:59:59[UTC]');
      
      // Act
      const result = getFrequencyKey(dt);
      
      // Assert
      expect(result).toBe('2024-12-25T23:59:59');
    });
  });

  describe('generateZeroFrequencies', () => {
    // We use a fixed reference point for deterministic tests: Monday, May 20th, 2024
    const now = Temporal.ZonedDateTime.from('2024-05-20T12:00:00[UTC]');

    it('should return a frequency object containing all expected granularities', () => {
      const result = generateZeroFrequencies(now);
      
      expect(result).toHaveProperty('years');
      expect(result).toHaveProperty('months');
      expect(result).toHaveProperty('weeks');
      expect(result).toHaveProperty('days');
    });

    it('should initialize summary population to "insufficient" for all granularities', () => {
      const result = generateZeroFrequencies(now);
      
      expect(result.days.summary.populated).toBe('insufficient');
      expect(result.weeks.summary.populated).toBe('insufficient');
    });

    it('should populate the "days" granularity with 24 hourly buckets starting from yesterday', () => {
      const result = generateZeroFrequencies(now);
      const days = result.days;
      
      expect(days.size).toBe(24);
      expect(days.from.toString()).toContain('2024-05-19T00:00:00');
      expect(Object.keys(days.frequencies)).toHaveLength(24);
      
      const firstKey = Object.keys(days.frequencies)[0];
      expect(firstKey).toBe('2024-05-19T00:00:00');
      expect(days.frequencies[firstKey].value).toBe(0);
    });

    it('should populate the "weeks" granularity with 7 daily buckets starting from the beginning of the previous week', () => {
      const result = generateZeroFrequencies(now);
      const weeks = result.weeks;
      
      // 2024-05-20 is Monday (dayOfWeek=1). currentWeek is May 20. previousWeek is May 13.
      expect(weeks.size).toBe(7);
      expect(weeks.from.toString()).toContain('2024-05-13T00:00:00');
      expect(Object.keys(weeks.frequencies)).toHaveLength(7);
    });

    it('should handle missing "now" parameter by using system time', () => {
      const result = generateZeroFrequencies();
      expect(result.days.from).toBeInstanceOf(Temporal.ZonedDateTime);
    });
  });
});

// Suggestion: In generateZeroFrequencies, the calculation `previousDay = currentDay.with({ day: now.day - 1 })` 
// will fail if `now.day` is 1 (start of month), because `day: 0` is invalid in Temporal. 
// Use `currentDay.subtract({ days: 1 })` instead for safe calendar arithmetic.
// Suggestion: The mapping for 'years' uses 'months' as the durationKey. Ensure that the 12-bucket 
// breakdown starting from 'previousYear' correctly represents the chronological span intended for the UI.