import { describe, it, expect } from 'vitest';
import { getConvergenceSummary } from './convergence';
import { DiaryEntryUiOptional } from '../types';

describe('convergence utility', () => {
  describe('getConvergenceSummary', () => {
    it('should return default state when entries list is empty', () => {
      const entries: DiaryEntryUiOptional[] = [];
      const result = getConvergenceSummary(entries);

      expect(result).toEqual({
        canInitiateConvergence: false,
        isConverging: false,
        progress: 0,
        shouldInitiateConvergence: false,
      });
    });

    it('should ignore entries without a status property', () => {
      const entries = [
        { text: 'Hello World' } as DiaryEntryUiOptional,
      ];
      const result = getConvergenceSummary(entries);

      expect(result.progress).toBe(0);
      expect(result.canInitiateConvergence).toBe(false);
    });

    it('should ignore entries with unknown statuses (e.g., draft)', () => {
      const entries: DiaryEntryUiOptional[] = [
        { text: 'Drafting...', status: 'draft' } as DiaryEntryUiOptional,
      ];
      const result = getConvergenceSummary(entries);

      expect(result.progress).toBe(0);
      expect(result.canInitiateConvergence).toBe(false);
    });

    it('should set isConverging to true if any entry is in processing status', () => {
      const entries: DiaryEntryUiOptional[] = [
        { text: 'Processing...', status: 'processing' },
      ];
      const result = getConvergenceSummary(entries);

      expect(result.isConverging).toBe(true);
      expect(result.canInitiateConvergence).toBe(false);
    });

    it('should calculate progress based on committed character count', () => {
      const entries: DiaryEntryUiOptional[] = [
        { text: 'a'.repeat(500), status: 'committed' },
      ];
      const result = getConvergenceSummary(entries);

      expect(result.progress).toBe(0.5);
      expect(result.canInitiateConvergence).toBe(true);
      expect(result.shouldInitiateConvergence).toBe(false);
    });

    it('should cap progress at 1.0 when charCount exceeds 1000', () => {
      const entries: DiaryEntryUiOptional[] = [
        { text: 'a'.repeat(1200), status: 'committed' },
      ];
      const result = getConvergenceSummary(entries);

      expect(result.progress).toBe(1);
      expect(result.shouldInitiateConvergence).toBe(true);
    });

    it('should set shouldInitiateConvergence to true exactly at 1000 chars', () => {
      const entries: DiaryEntryUiOptional[] = [
        { text: 'a'.repeat(1000), status: 'committed' },
      ];
      const result = getConvergenceSummary(entries);

      expect(result.progress).toBe(1);
      expect(result.shouldInitiateConvergence).toBe(true);
      expect(result.canInitiateConvergence).toBe(true);
    });

    it('should prevent initiation if already converging even if thresholds are met', () => {
      const entries: DiaryEntryUiOptional[] = [
        { text: 'a'.repeat(1000), status: 'committed' },
        { text: '', status: 'processing' },
      ];
      const result = getConvergenceSummary(entries);

      expect(result.isConverging).toBe(true);
      expect(result.progress).toBe(1);
      expect(result.canInitiateConvergence).toBe(false);
      expect(result.shouldInitiateConvergence).toBe(false);
    });

    it('should aggregate text from multiple committed entries', () => {
      const entries: DiaryEntryUiOptional[] = [
        { text: 'abc', status: 'committed' },
        { text: 'def', status: 'committed' },
      ];
      const result = getConvergenceSummary(entries);

      // charCount = 6. progress = 6/1000
      expect(result.progress).toBe(0.006);
      expect(result.canInitiateConvergence).toBe(true);
    });

    it('should handle entries with empty text but committed status', () => {
      const entries: DiaryEntryUiOptional[] = [
        { text: '', status: 'committed' },
      ];
      const result = getConvergenceSummary(entries);

      expect(result.progress).toBe(0);
      expect(result.canInitiateConvergence).toBe(false);
    });
  });
});

// Suggestion: The reduce logic uses `if (!('status' in props))`. In TypeScript, if DiaryEntryUiOptional 
// defines status as optional, accessing it directly from props (which is the rest of the object) 
// is safe. The extra check is robust for runtime but might be redundant if types are strictly enforced.
// Suggestion: The progress calculation `Math.min(charCount / 1000, 1)` uses a hardcoded magic number 1000. 
// This should probably be a shared constant.