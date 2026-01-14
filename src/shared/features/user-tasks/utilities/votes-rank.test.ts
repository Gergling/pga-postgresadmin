import { describe, it, expect } from 'vitest';
import { TASK_IMPORTANCE_RANKS, TASK_MOMENTUM_RANKS } from '../constants';
import { getRankMapping } from './votes-rank';

describe('votes-rank', () => {
  describe('getRankMapping', () => {
    it('returns the importance rank mapping when "importance" is requested', () => {
      expect(getRankMapping('importance')).toBe(TASK_IMPORTANCE_RANKS);
    });

    it('returns the momentum rank mapping when "momentum" is requested', () => {
      expect(getRankMapping('momentum')).toBe(TASK_MOMENTUM_RANKS);
    });
  });
});
