import { describe, it, expect } from 'vitest';
import { TASK_IMPORTANCE_RANKS, TASK_MOMENTUM_RANKS } from '../constants';
import { getRankMapping, getVoteRank } from './votes-rank';

describe('votes-rank', () => {
  describe('getRankMapping', () => {
    it('returns the importance rank mapping when "importance" is requested', () => {
      expect(getRankMapping('importance')).toBe(TASK_IMPORTANCE_RANKS);
    });

    it('returns the momentum rank mapping when "momentum" is requested', () => {
      expect(getRankMapping('momentum')).toBe(TASK_MOMENTUM_RANKS);
    });
  });

  describe('getVoteRank', () => {
    it('returns the correct rank for an importance vote', () => {
      const rank = getVoteRank('importance', 'Critical');
      expect(rank).toBe(TASK_IMPORTANCE_RANKS['Critical']);
    });

    it('returns the correct rank for a momentum vote', () => {
      const rank = getVoteRank('momentum', 'Propulsive');
      expect(rank).toBe(TASK_MOMENTUM_RANKS['Propulsive']);
    });
  });
});
