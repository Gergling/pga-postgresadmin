import { describe, it, expect } from 'vitest';
import { Temporal } from "@js-temporal/polyfill";
import { mapDiaryEntryUiToDb, mapDiaryEntryDbToUi } from './db';
import type { DiaryEntryUi } from '../types';
import type { DiaryEntryDb } from '../../../../shared/features/diary/types';

describe('diary db utilities', () => {
  // Constants for deterministic testing
  const MOCK_EPOCH = 1704067200000; // 2024-01-01T00:00:00Z
  const MOCK_INSTANT = Temporal.Instant.fromEpochMilliseconds(MOCK_EPOCH);
  const MOCK_ID = 'entry-123';
  const MOCK_TEXT = 'This is a test diary entry';

  describe('mapDiaryEntryUiToDb', () => {
    it('should convert created from Temporal.Instant to epoch milliseconds', () => {
      // Arrange
      // We use a partial/cast strategy here because we don't have visibility of all fields 
      // in the imported types, but we must satisfy the mapping logic requirements.
      const uiEntry = {
        id: MOCK_ID,
        text: MOCK_TEXT,
        created: MOCK_INSTANT,
      } as DiaryEntryUi;

      // Act
      const result = mapDiaryEntryUiToDb(uiEntry);

      // Assert
      expect(result.created).toBe(MOCK_EPOCH);
    });

    it('should preserve all other properties from the UI object', () => {
      // Arrange
      const uiEntry = {
        id: MOCK_ID,
        text: MOCK_TEXT,
        created: MOCK_INSTANT,
        extraField: 'should-stay',
      } as unknown as DiaryEntryUi;

      // Act
      const result = mapDiaryEntryUiToDb(uiEntry) as DiaryEntryDb & { extraField: string };

      // Assert
      expect(result.id).toBe(MOCK_ID);
      expect(result.text).toBe(MOCK_TEXT);
      expect(result.extraField).toBe('should-stay');
    });

    it('should handle the Unix epoch (0) correctly', () => {
      // Arrange
      const uiEntry = {
        created: Temporal.Instant.fromEpochMilliseconds(0),
      } as DiaryEntryUi;

      // Act
      const result = mapDiaryEntryUiToDb(uiEntry);

      // Assert
      expect(result.created).toBe(0);
    });
  });

  describe('mapDiaryEntryDbToUi', () => {
    it('should convert created from epoch milliseconds to Temporal.Instant', () => {
      // Arrange
      const dbEntry = {
        id: MOCK_ID,
        text: MOCK_TEXT,
        created: MOCK_EPOCH,
      } as DiaryEntryDb;

      // Act
      const result = mapDiaryEntryDbToUi(dbEntry);

      // Assert
      expect(result.created).toBeInstanceOf(Temporal.Instant);
      expect(result.created.epochMilliseconds).toBe(MOCK_EPOCH);
      expect(result.created.equals(MOCK_INSTANT)).toBe(true);
    });

    it('should preserve all other properties from the DB object', () => {
      // Arrange
      const dbEntry = {
        id: MOCK_ID,
        text: MOCK_TEXT,
        created: MOCK_EPOCH,
        metadata: { source: 'test' },
      } as unknown as DiaryEntryDb;

      // Act
      const result = mapDiaryEntryDbToUi(dbEntry) as DiaryEntryUi & { metadata: object };

      // Assert
      expect(result.id).toBe(MOCK_ID);
      expect(result.text).toBe(MOCK_TEXT);
      expect(result.metadata).toEqual({ source: 'test' });
    });

    it('should correctly map negative epoch values (pre-1970)', () => {
      // Arrange
      const pre1970Epoch = -31536000000; // 1969-01-01
      const dbEntry = {
        created: pre1970Epoch,
      } as DiaryEntryDb;

      // Act
      const result = mapDiaryEntryDbToUi(dbEntry);

      // Assert
      expect(result.created.epochMilliseconds).toBe(pre1970Epoch);
      expect(result.created.toString()).toContain('1969');
    });
  });
});

// Suggestion: The mappers use the spread operator (`...rest`), which is safe for shallow objects. 
// If DiaryEntry objects contain nested complex types that require deep cloning or specific 
// serialization for IPC/Database, consider more explicit mapping for those fields.