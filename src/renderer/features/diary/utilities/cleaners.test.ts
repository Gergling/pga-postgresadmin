import { describe, it, expect } from 'vitest';
import { Temporal } from "@js-temporal/polyfill";
import { cleanEntry, cleanEntries } from './cleaners';
import { DiaryEntryUi, DiaryEntryUiOptional } from "../types";

describe('cleaners', () => {
  describe('cleanEntry', () => {
    it('should convert a numeric timestamp to a Temporal.Instant', () => {
      // Arrange
      const timestamp = 1715856000000; // 2024-05-16T10:40:00Z
      const input: DiaryEntryUiOptional = {
        id: 'test-1',
        content: 'hello',
        created: timestamp,
      };

      // Act
      const result = cleanEntry(input);

      // Assert
      expect(result.created).toBeInstanceOf(Temporal.Instant);
      expect((result.created as Temporal.Instant).epochMilliseconds).toBe(timestamp);
      expect(result.id).toBe('test-1');
      expect(result.content).toBe('hello');
    });

    it('should return the object as-is if created is not a number (e.g., already an Instant)', () => {
      // Arrange
      const instant = Temporal.Instant.fromEpochMilliseconds(1715856000000);
      const input: DiaryEntryUiOptional = {
        id: 'test-2',
        created: instant,
      };

      // Act
      const result = cleanEntry(input);

      // Assert
      expect(result.created).toBe(instant);
      expect(result.id).toBe('test-2');
    });

    it('should return the object as-is if created is undefined', () => {
      // Arrange
      const input: DiaryEntryUiOptional = {
        id: 'test-3',
        created: undefined,
      };

      // Act
      const result = cleanEntry(input);

      // Assert
      expect(result.created).toBeUndefined();
      expect(result.id).toBe('test-3');
    });
  });

  describe('cleanEntries', () => {
    it('should clean and sort entries by date descending', () => {
      // Arrange
      const entries: DiaryEntryUiOptional[] = [
        { id: 'old', created: 1000 },
        { id: 'new', created: 3000 },
        { id: 'mid', created: 2000 },
      ];

      // Act
      const result = cleanEntries(entries);

      // Assert
      expect(result).toHaveLength(3);
      expect((result[0].created as Temporal.Instant).epochMilliseconds).toBe(3000);
      expect((result[1].created as Temporal.Instant).epochMilliseconds).toBe(2000);
      expect((result[2].created as Temporal.Instant).epochMilliseconds).toBe(1000);
    });

    it('should place entries without a created property at the end', () => {
      // Arrange
      const entries: DiaryEntryUiOptional[] = [
        { id: 'no-date' },
        { id: 'with-date', created: 1000 },
      ];

      // Act
      const result = cleanEntries(entries);

      // Assert
      expect(result[0].id).toBe('with-date');
      expect(result[1].id).toBe('no-date');
    });

    it('should maintain relative order if both entries lack a created property', () => {
      // Arrange
      const entries: DiaryEntryUiOptional[] = [
        { id: 'no-date-1' },
        { id: 'no-date-2' },
      ];

      // Act
      const result = cleanEntries(entries);

      // Assert
      expect(result[0].id).toBe('no-date-1');
      expect(result[1].id).toBe('no-date-2');
    });

    it('should handle sorting when b lacks a created property', () => {
      // Arrange
      const entries: DiaryEntryUiOptional[] = [
        { id: 'no-date' },
        { id: 'with-date', created: 1000 },
      ];
      // Input array in different order to hit the !bNoCreateTime branch logic
      const reversedEntries = [entries[1], entries[0]];

      // Act
      const result = cleanEntries(reversedEntries);

      // Assert
      expect(result[0].id).toBe('with-date');
      expect(result[1].id).toBe('no-date');
    });

    it('should return an empty array when given an empty array', () => {
      // Act
      const result = cleanEntries([]);

      // Assert
      expect(result).toEqual([]);
    });

    it('should correctly sort when mixed with existing Temporal.Instant objects', () => {
      // Arrange
      const entries: DiaryEntryUiOptional[] = [
        { id: 'num', created: 1000 },
        { id: 'inst', created: Temporal.Instant.fromEpochMilliseconds(2000) },
      ];

      // Act
      const result = cleanEntries(entries);

      // Assert
      expect((result[0].created as Temporal.Instant).epochMilliseconds).toBe(2000);
      expect((result[1].created as Temporal.Instant).epochMilliseconds).toBe(1000);
    });
  });
});

// Suggestion: In `cleanEntry`, if `created` is undefined, the returned object still contains the key `{ created: undefined }`. 
// In `cleanEntries`, the sort logic uses `'created' in a`. 
// If an object is passed as `{ id: '1', created: undefined }`, `'created' in a` will be true, 
// but `a.created` will be undefined, potentially causing a runtime error when accessing `b.created.epochMilliseconds`. 
// Consider checking for nullish values instead of property existence, or ensure `cleanEntry` removes the key if it's undefined.