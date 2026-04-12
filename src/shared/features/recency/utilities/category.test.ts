import { Temporal } from "@js-temporal/polyfill";
import { describe, it, expect } from 'vitest';
import { getTemporalRelativeCategory } from './category';
import { TemporalGranularity } from "../config";

describe('getTemporalRelativeCategory', () => {
  const now = Temporal.ZonedDateTime.from('2024-05-20T12:00:00[UTC]');
  const windowThreshold = Temporal.ZonedDateTime.from('2024-05-20T00:00:00[UTC]'); // Start of today
  const priorThreshold = Temporal.ZonedDateTime.from('2024-05-19T00:00:00[UTC]');  // Start of yesterday
  const granularity: TemporalGranularity = 'days';

  it('should return "older" when the prior threshold is before the target date (matches current inverted implementation)', () => {
    // Implementation: if (prior.epochMilliseconds < date.epochMilliseconds) return 'older';
    const date = Temporal.ZonedDateTime.from('2024-05-19T01:00:00[UTC]');
    const since = Temporal.Duration.from({ days: 0 });
    const result = getTemporalRelativeCategory(date, priorThreshold, since, granularity, windowThreshold, now);
    expect(result).toBe('older');
  });

  it('should return "future" when target date is after now (and prior check is bypassed)', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-21T00:00:00[UTC]');
    const futurePrior = Temporal.ZonedDateTime.from('2025-01-01T00:00:00[UTC]');
    const since = Temporal.Duration.from({ days: 0 });
    const result = getTemporalRelativeCategory(date, futurePrior, since, granularity, windowThreshold, now);
    expect(result).toBe('future');
  });

  it('should return "prior" when target granularity in the duration is greater than zero', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-19T12:00:00[UTC]');
    const futurePrior = Temporal.ZonedDateTime.from('2025-01-01T00:00:00[UTC]');
    const since = Temporal.Duration.from({ days: 1 });
    const result = getTemporalRelativeCategory(date, futurePrior, since, granularity, windowThreshold, now);
    expect(result).toBe('prior');
  });

  it('should return "window" when date is after the window threshold', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
    const futurePrior = Temporal.ZonedDateTime.from('2025-01-01T00:00:00[UTC]');
    const since = Temporal.Duration.from({ days: 0 });
    const result = getTemporalRelativeCategory(date, futurePrior, since, granularity, windowThreshold, now);
    expect(result).toBe('window');
  });

  it('should return "overlap" as the fallback when no other conditions are met', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-19T23:59:00[UTC]');
    const futurePrior = Temporal.ZonedDateTime.from('2025-01-01T00:00:00[UTC]');
    const since = Temporal.Duration.from({ days: 0 });
    const result = getTemporalRelativeCategory(date, futurePrior, since, granularity, windowThreshold, now);
    expect(result).toBe('overlap');
  });

  it('should handle missing optional "now" parameter', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-19T23:59:00[UTC]');
    const futurePrior = Temporal.ZonedDateTime.from('2025-01-01T00:00:00[UTC]');
    const since = Temporal.Duration.from({ days: 0 });
    const result = getTemporalRelativeCategory(date, futurePrior, since, granularity, windowThreshold);
    // Without 'now', it skips the future check and falls through to overlap (assuming window check also fails)
    expect(result).toBe('overlap');
  });
});

// Suggestion: In category.ts, the logic for 'older' (prior < date) seems inverted if 'prior' is a past threshold. 
// Usually, an entry is 'older' if its date is BEFORE the prior threshold (date < prior).
// Suggestion: The calling signature in frequencies.ts currently passes only 4 arguments, which mismatches 
// the 5+ required parameters in category.ts. These files need synchronization.