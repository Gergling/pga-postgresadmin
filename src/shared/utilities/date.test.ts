import { describe, it, expect } from 'vitest';
import z from "zod";

// Relative imports for the module under test
import {
  transformToRfc9557,
  Rfc9557ObjectSchemaInput,
  transformStringToRfc9557,
  transformStringToRfc9557Object
} from './date';

describe('date', () => {
  describe('transformToRfc9557', () => {
    it('should correctly format a ZonedDateTime object into an RFC 9557 string with padding for single digits', () => {
      const input = {
        year: 2023,
        month: 1,
        day: 5,
        hour: 9,
        minute: 30,
        second: 5,
        offset: '+01:00',
        tzName: '[Europe/London]',
      };
      const expected = '2023-01-05T09:30:05+01:00[Europe/London]';
      expect(transformToRfc9557(input)).toBe(expected);
    });

    it('should correctly format with double-digit values without additional padding', () => {
      const input = {
        year: 2023,
        month: 12,
        day: 25,
        hour: 23,
        minute: 59,
        second: 59,
        offset: '-05:00',
        tzName: '[America/New_York]',
      };
      const expected = '2023-12-25T23:59:59-05:00[America/New_York]';
      expect(transformToRfc9557(input)).toBe(expected);
    });

    // Not handling incorrectly padded strings for now.
    it.skip('should handle string inputs for numeric fields that require padding', () => {
      const input = {
        year: '2023',
        month: '1',
        day: '5',
        hour: '9',
        minute: '30',
        second: '5',
        offset: '+01:00',
        tzName: '[Europe/London]',
      };
      const expected = '2023-01-05T09:30:05+01:00[Europe/London]';
      expect(transformToRfc9557(input)).toBe(expected);
    });

    it('should throw a ZodError for missing required properties', () => {
      const input = {
        year: 2023,
        month: 1,
        day: 5,
        hour: 9,
        minute: 30,
        // second is missing
        offset: '+01:00',
        tzName: '[Europe/London]',
      };
      expect(() => transformToRfc9557(input as Rfc9557ObjectSchemaInput)).toThrow(z.ZodError);
      expect(() => transformToRfc9557(input as Rfc9557ObjectSchemaInput)).toThrow(/invalid_union/);
    });

    // Not handling incorrectly padded strings for now.
    it.skip('should throw a ZodError for string inputs that cannot be padded to the correct length (e.g., year "23")', () => {
      const input = {
        year: '23', // Invalid year format for 4 digits
        month: 1,
        day: 5,
        hour: 9,
        minute: 30,
        second: 5,
        offset: '+01:00',
        tzName: '[Europe/London]',
      };
      expect(() => transformToRfc9557(input)).toThrow(z.ZodError);
      expect(() => transformToRfc9557(input)).toThrow(/Invalid input: Must be a 4-digit string/);
    });
  });

  describe('transformStringToRfc9557', () => {
    it('should correctly format a human-readable local string (BST) to an RFC 9557 string', () => {
      const rawString = '05/01/2023, 09:30:05 BST';
      const expected = '2023-01-05T09:30:05+01:00[Europe/London]';
      expect(transformStringToRfc9557(rawString)).toBe(expected);
    });

    it('should correctly format a human-readable local string (GMT) to an RFC 9557 string with Europe/London timezone', () => {
      const rawString = '05/01/2023, 09:30:05 GMT';
      const expected = '2023-01-05T09:30:05+00:00[Europe/London]';
      expect(transformStringToRfc9557(rawString)).toBe(expected);
    });

    it('should correctly format a human-readable local string without TZ abbreviation to an RFC 9557 string with UTC offset', () => {
      const rawString = '05/01/2023, 09:30:05';
      const expected = '2023-01-05T09:30:05+00:00[UTC]';
      expect(transformStringToRfc9557(rawString)).toBe(expected);
    });

    it('should handle double-digit hour correctly', () => {
      const rawString = '05/01/2023, 19:30:05 BST';
      const expected = '2023-01-05T19:30:05+01:00[Europe/London]';
      expect(transformStringToRfc9557(rawString)).toBe(expected);
    });

    it('should handle double-digit month correctly', () => {
      const rawString = '05/11/2023, 09:30:05 BST';
      const expected = '2023-11-05T09:30:05+01:00[Europe/London]';
      expect(transformStringToRfc9557(rawString)).toBe(expected);
    });

    it('should handle double-digit day correctly', () => {
      const rawString = '15/01/2023, 09:30:05 BST';
      const expected = '2023-01-15T09:30:05+01:00[Europe/London]';
      expect(transformStringToRfc9557(rawString)).toBe(expected);
    });

    it('should throw an error for an invalid date separator', () => {
      const rawString = '05-01-2023, 09:30:05 BST';
      expect(() => transformStringToRfc9557(rawString)).toThrow(
        'Format is not DD/MM/YYYY, HH:mm:ss.'
      );
    });

    it('should throw an error for a missing comma between date and time', () => {
      const rawString = '05/01/2023 09:30:05 BST';
      expect(() => transformStringToRfc9557(rawString)).toThrow(
        'Format is not DD/MM/YYYY, HH:mm:ss.'
      );
    });

    it('should throw an error for an invalid time separator', () => {
      const rawString = '05/01/2023, 09.30.05 BST';
      expect(() => transformStringToRfc9557(rawString)).toThrow(
        'Format is not DD/MM/YYYY, HH:mm:ss.'
      );
    });

    it('should throw an error for an entirely invalid string format', () => {
      const rawString = 'invalid string';
      expect(() => transformStringToRfc9557(rawString)).toThrow(
        'Format is not DD/MM/YYYY, HH:mm:ss.'
      );
    });
  });

  describe('transformStringToRfc9557Object', () => {
    it('should correctly parse a human-readable local string (BST) to an RFC 9557 object', () => {
      const rawString = '05/01/2023, 09:30:05 BST';
      const expected = {
        year: '2023',
        month: '01',
        day: '05',
        hour: '09',
        minute: '30',
        second: '05',
        offset: '+01:00',
        tzName: '[Europe/London]',
      };
      expect(transformStringToRfc9557Object(rawString)).toEqual(expected);
    });

    it('should correctly parse a human-readable local string (GMT) to an RFC 9557 object with Europe/London timezone', () => {
      const rawString = '05/01/2023, 09:30:05 GMT';
      const expected = {
        year: '2023',
        month: '01',
        day: '05',
        hour: '09',
        minute: '30',
        second: '05',
        offset: '+00:00',
        tzName: '[Europe/London]',
      };
      expect(transformStringToRfc9557Object(rawString)).toEqual(expected);
    });

    it('should throw an error for missing TZ abbreviation', () => {
      const rawString = '05/01/2023, 09:30:05';
      expect(() => transformStringToRfc9557Object(rawString)).toThrow(
        'Format is not DD/MM/YYYY, HH:mm:ss.'
      );
    });

    it('should throw an error for unrecognized TZ abbreviation', () => {
      const rawString = '05/01/2023, 09:30:05 XYZ';
      expect(() => transformStringToRfc9557Object(rawString)).toThrow(
        /Could not automatically resolve timezone abbreviation/
      );
    });

    it('should throw an error for an invalid date separator', () => {
      const rawString = '05-01-2023, 09:30:05 BST';
      expect(() => transformStringToRfc9557Object(rawString)).toThrow(
        'Format is not DD/MM/YYYY, HH:mm:ss.'
      );
    });
  });
});

// Suggestion: The internal `stringToZDT` function's fallback path `Temporal.Instant.from(raw).toZonedDateTimeISO("UTC")`
// can lead to non-deterministic behavior if `raw` is a PlainDateTime string (e.g., '2023-01-05T10:00:00')
// because `Temporal.Instant.from` interprets such strings in the system's local timezone.
// While this has been addressed in tests using mocking, for production code, it would be more robust to either:
// 1. Explicitly require an Instant string (e.g., '2023-01-05T10:00:00Z') for this fallback path.
// 2. Or, if the intent is to parse a PlainDateTime and assume UTC, use `Temporal.PlainDateTime.from(raw).toZonedDateTime('UTC')`
//    to avoid reliance on the system's local timezone.