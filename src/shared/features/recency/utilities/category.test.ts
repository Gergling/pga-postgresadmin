import { Temporal } from "@js-temporal/polyfill";
import { describe, it, expect } from 'vitest';
import { getTemporalRelativeCategory } from './category';

describe('getTemporalRelativeCategory', () => {
  const now = Temporal.ZonedDateTime.from('2024-05-20T12:00:00[UTC]');
  const window = Temporal.ZonedDateTime.from('2024-05-20T00:00:00[UTC]'); // Start of today
  const overlap = Temporal.ZonedDateTime.from('2024-05-19T12:00:00[UTC]'); // Halfway through yesterday
  const prior = Temporal.ZonedDateTime.from('2024-05-19T00:00:00[UTC]');  // Start of yesterday
  const thresholds = { prior, overlap, window, now };

  it('should return "future" when target date is after now', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-20T12:00:01[UTC]');
    const result = getTemporalRelativeCategory(date, thresholds);
    expect(result).toBe('future');
  });

  it('should return "window" when date is between window and now', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-20T10:00:00[UTC]');
    const result = getTemporalRelativeCategory(date, thresholds);
    expect(result).toBe('window');
  });

  it('should return "overlap" when date is between overlap and window', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-19T23:59:00[UTC]');
    const result = getTemporalRelativeCategory(date, thresholds);
    expect(result).toBe('overlap');
  });

  it('should return "prior" when date is between prior and overlap', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-19T06:00:00[UTC]');
    const result = getTemporalRelativeCategory(date, thresholds);
    expect(result).toBe('prior');
  });

  it('should return "older" when the target date is before the prior threshold', () => {
    const date = Temporal.ZonedDateTime.from('2024-05-18T23:00:00[UTC]');
    const result = getTemporalRelativeCategory(date, thresholds);
    expect(result).toBe('older');
  });
});
