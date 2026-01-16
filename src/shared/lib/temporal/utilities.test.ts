import { Temporal } from '@js-temporal/polyfill';
import { describe, expect, it } from 'vitest';
import {
  getExtendedLogicValue,
  getReadableFormat,
  getReadableUnit,
  getRelativePropTimeString,
  getRelativeTimeString
} from './utilities';

describe('temporal utilities', () => {
  describe('getReadableUnit', () => {
    it('returns singular unit when value is 1', () => {
      expect(getReadableUnit(1, 'days')).toBe('day');
      expect(getReadableUnit(1, 'weeks')).toBe('week');
      expect(getReadableUnit(1, 'years')).toBe('year');
    });

    it('returns plural unit when value is not 1', () => {
      expect(getReadableUnit(0, 'days')).toBe('days');
      expect(getReadableUnit(2, 'days')).toBe('days');
      expect(getReadableUnit(5, 'weeks')).toBe('weeks');
    });
  });

  describe('getReadableFormat', () => {
    it('formats the string correctly', () => {
      expect(getReadableFormat(5, 'days')).toBe('5 days ago');
      expect(getReadableFormat(1, 'week')).toBe('1 week ago');
    });
  });

  describe('getRelativePropTimeString', () => {
    it('returns formatted string with correct unit plurality', () => {
      expect(getRelativePropTimeString(1, 'days')).toBe('1 day ago');
      expect(getRelativePropTimeString(2, 'days')).toBe('2 days ago');
    });
  });

  describe('getExtendedLogicValue', () => {
    it('converts days to weeks if days >= 7', () => {
      expect(getExtendedLogicValue(7, 'days')).toEqual({ prop: 'weeks', value: 1 });
      expect(getExtendedLogicValue(14, 'days')).toEqual({ prop: 'weeks', value: 2 });
      expect(getExtendedLogicValue(10, 'days')).toEqual({ prop: 'weeks', value: 1 });
    });

    it('keeps days if days < 7', () => {
      expect(getExtendedLogicValue(6, 'days')).toEqual({ prop: 'days', value: 6 });
    });

    it('returns original prop and value for non-days props', () => {
      expect(getExtendedLogicValue(24, 'hours')).toEqual({ prop: 'hours', value: 24 });
      expect(getExtendedLogicValue(12, 'months')).toEqual({ prop: 'months', value: 12 });
    });
  });

  describe('getRelativeTimeString', () => {
    it('returns "just now" for empty duration or sub-second duration', () => {
      const duration = Temporal.Duration.from({ milliseconds: 500 });
      expect(getRelativeTimeString(duration)).toBe('just now');
    });

    it('prioritizes larger units (years over months)', () => {
      const duration = Temporal.Duration.from({ years: 1, months: 5 });
      expect(getRelativeTimeString(duration)).toBe('1 year ago');
    });

    it('handles seconds', () => {
      const duration = Temporal.Duration.from({ seconds: 30 });
      expect(getRelativeTimeString(duration)).toBe('30 seconds ago');
    });

    it('handles days < 7', () => {
      const duration = Temporal.Duration.from({ days: 5 });
      expect(getRelativeTimeString(duration)).toBe('5 days ago');
    });

    it('handles days >= 7 (weeks logic)', () => {
      const duration = Temporal.Duration.from({ days: 14 });
      expect(getRelativeTimeString(duration)).toBe('2 weeks ago');
    });
  });
});
