import { describe, it, expect } from 'vitest';
import {
  compareExperimentalModelActionClassifications,
  compareStableModelActionClassifications
} from './utilities';

describe('Model Classification Comparators', () => {

  describe('compareExperimentalModelActionClassifications', () => {
    // Expected order: 'no-data' < 'potential' < 'retryable' < 'stable' < 'unsuccessful'

    it('identifies identical classifications as equal', () => {
      expect(compareExperimentalModelActionClassifications('stable', 'stable')).toBe(0);
      expect(compareExperimentalModelActionClassifications('no-data', 'no-data')).toBe(0);
    });

    it('ranks standard items correctly based on the experimental lifecycle layout', () => {
      // 'no-data' (index 0) comes before 'potential' (index 1) -> negative value
      expect(compareExperimentalModelActionClassifications('no-data', 'potential')).toBeLessThan(0);

      // 'unsuccessful' (index 4) comes after 'stable' (index 3) -> positive value
      expect(compareExperimentalModelActionClassifications('unsuccessful', 'stable')).toBeGreaterThan(0);

      // 'retryable' (index 2) comes before 'stable' (index 3) -> negative value
      expect(compareExperimentalModelActionClassifications('retryable', 'stable')).toBeLessThan(0);
    });
  });

  describe('compareStableModelActionClassifications', () => {
    // Expected order: 'stable' < 'potential' < 'retryable' < 'no-data' < 'unsuccessful'

    it('identifies identical classifications as equal', () => {
      expect(compareStableModelActionClassifications('potential', 'potential')).toBe(0);
    });

    it('prioritises mature classifications over legacy items', () => {
      // 'stable' (index 0) comes before 'potential' (index 1) -> negative value
      expect(compareStableModelActionClassifications('stable', 'potential')).toBeLessThan(0);

      // 'stable' (index 0) comes before 'no-data' (index 3) -> negative value
      expect(compareStableModelActionClassifications('stable', 'no-data')).toBeLessThan(0);

      // 'unsuccessful' (index 4) comes after 'no-data' (index 3) -> positive value
      expect(compareStableModelActionClassifications('unsuccessful', 'no-data')).toBeGreaterThan(0);
    });
  });

  describe('Cross-Strategy Validation', () => {
    it('demonstrates inverted priorities between experimental and stable rules', () => {
      const classA = 'stable';
      const classB = 'no-data';

      const experimentalResult = compareExperimentalModelActionClassifications(classA, classB);
      const stableResult = compareStableModelActionClassifications(classA, classB);

      // Experimental: no-data (0) < stable (3) -> stable is greater than no-data
      expect(experimentalResult).toBeGreaterThan(0);

      // Stable: stable (0) < no-data (3) -> stable is less than no-data
      expect(stableResult).toBeLessThan(0);
    });
  });
});
