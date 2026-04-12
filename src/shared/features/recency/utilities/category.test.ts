import { Temporal } from "@js-temporal/polyfill";
import { describe, it, expect } from 'vitest';
import { getTemporalRelativeCategory } from './category';
import { TemporalGranularity } from "../config";

describe('getTemporalRelativeCategory', () => {
  // We use a fixed reference point for deterministic tests
  const baseDate = Temporal.ZonedDateTime.from('2024-05-20T12:00:00[UTC]');

  describe('window category', () => {
    it('should return "window" if the duration since is 0 for the specified granularity', () => {
      // Arrange
      const date = baseDate;
      const since = Temporal.Duration.from({ days: 0, hours: 5 }); // Granularity 'days' is 0
      const granularity: TemporalGranularity = 'days';
      const prior = baseDate.subtract({ days: 1 });

      // Act
      const result = getTemporalRelativeCategory(date, since, granularity, prior);

      // Assert
      expect(result).toBe('window');
    });
  });

  describe('overlap category', () => {
    it('should return "overlap" if since is non-zero but the date is after the prior threshold', () => {
      // Arrange
      // The date is effectively in the "previous" bucket of time, but is still more recent than our 'prior' boundary.
      const date = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
      const since = Temporal.Duration.from({ days: 1 });
      const granularity: TemporalGranularity = 'days';
      const prior = Temporal.ZonedDateTime.from('2024-05-20T11:00:00[UTC]');

      // Act
      const result = getTemporalRelativeCategory(date, since, granularity, prior);

      // Assert
      expect(result).toBe('overlap');
    });
  });

  describe('prior category', () => {
    it('should return "prior" if since is non-zero and the date is before the prior threshold', () => {
      // Arrange
      const date = Temporal.ZonedDateTime.from('2024-05-19T12:00:00[UTC]');
      const since = Temporal.Duration.from({ days: 1 });
      const granularity: TemporalGranularity = 'days';
      const prior = Temporal.ZonedDateTime.from('2024-05-20T12:00:00[UTC]');

      // Act
      const result = getTemporalRelativeCategory(date, since, granularity, prior);

      // Assert
      expect(result).toBe('prior');
    });

    it('should return "prior" if the date is exactly equal to the prior threshold', () => {
      // Arrange
      const date = Temporal.ZonedDateTime.from('2024-05-20T12:00:00[UTC]');
      const since = Temporal.Duration.from({ days: 1 });
      const granularity: TemporalGranularity = 'days';
      const prior = Temporal.ZonedDateTime.from('2024-05-20T12:00:00[UTC]');

      // Act
      const result = getTemporalRelativeCategory(date, since, granularity, prior);

      // Assert
      expect(result).toBe('prior');
    });
  });
});

// Suggestion: Consider if the 'overlap' logic should use >= instead of > for the prior comparison 
// if the boundary itself should be considered part of the overlapping period.
// Suggestion: The granularity check `since[granularity] === 0` assumes the duration passed is 
// normalized to that granularity. Ensure callers handle normalization if they provide mixed-unit durations.