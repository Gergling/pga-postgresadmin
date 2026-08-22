import { describe, it, expect } from 'vitest';
import { comparatorFactory } from './comparison'; // Adjust path

describe('comparatorFactory', () => {
  // Base factory instance for numeric testing
  const { create, flip, rank, stack } = comparatorFactory<number>();

  describe('create', () => {
    it('returns the identical function instance provided to it', () => {
      const baseCompare = (a: number, b: number) => a - b;
      const created = create(baseCompare);

      expect(created).toBe(baseCompare);
      expect(created(1, 2)).toBe(-1);
    });
  });

  describe('flip', () => {
    const baseCompare = (a: number, b: number) => a - b;

    it('preserves the original evaluation order when set to asc', () => {
      const ascCompare = flip('asc', baseCompare);

      expect(ascCompare(5, 10)).toBeLessThan(0);
      expect(ascCompare(10, 5)).toBeGreaterThan(0);
      expect(ascCompare(5, 5)).toBe(0);
    });

    it('inverts the standard comparison outcome when set to desc', () => {
      const descCompare = flip('desc', baseCompare);

      expect(descCompare(5, 10)).toBeGreaterThan(0);
      expect(descCompare(10, 5)).toBeLessThan(0);
      expect(descCompare(5, 5)).toBe(0);
    });
  });

  describe('rank', () => {
    it('determines order based on item indices within the array', () => {
      const customRank = rank([3, 2, 1, 4]);

      expect(customRank(3, 1)).toBeLessThan(0);
      expect(customRank(4, 1)).toBeGreaterThan(0);
      expect(customRank(1, 1)).toBe(0);
    });

    it('calculates position differences predictably for missing items', () => {
      const customRank = rank([3, 2, 1, 4]);

      // Missing item is -1, item '1' is at index 2 (-1 - 2 = -3)
      expect(customRank(99, 1)).toBeLessThan(0);
    });
  });

  describe('stack', () => {
    it('defers to secondary rules when primary rules tie', () => {
      type User = { age: number; score: number };
      const { stack: userStack } = comparatorFactory<User>();

      const compareAge = (a: User, b: User) => a.age - b.age;
      const compareScore = (a: User, b: User) => a.score - b.score;
      const combined = userStack([compareAge, compareScore]);

      const user1 = { age: 20, score: 50 };
      const user2 = { age: 20, score: 100 };
      const user3 = { age: 25, score: 10 };

      // Identical ages trigger secondary score sorting
      expect(combined(user1, user2)).toBeLessThan(0);
      // Conflicting ages settle on the primary age rule
      expect(combined(user1, user3)).toBeLessThan(0);
    });

    it('yields neutral 0 if every nested validator evaluates to 0', () => {
      const neutralStack = stack([() => 0, () => 0]);

      expect(neutralStack(1, 2)).toBe(0);
    });

    it('defaults instantly to 0 when supplied an empty chain', () => {
      const emptyStack = stack([]);

      expect(emptyStack(1, 2)).toBe(0);
    });
  });
});
