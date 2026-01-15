import { describe, it, expect } from 'vitest';
import { CouncilMemberVotes, TaskVotes } from '../types';
import { reduceTaskVotes } from './votes-task';

describe('reduceTaskVotes', () => {
  const baseAccumulator: TaskVotes = {
    abstained: 0,
    awaiting: 0,
    echoes: 0,
    importance: 0,
    momentum: 0,
    mean: 0,
  };

  const createMemberVotes = (
    overrides: Partial<CouncilMemberVotes> = {}
  ): CouncilMemberVotes => ({
    member: 'librarian',
    atomised: {
      importance: { echo: false, rank: undefined, summary: '?', voteProp: 'importance' },
      momentum: { echo: false, rank: undefined, summary: '?', voteProp: 'momentum' },
    },
    summary: {
      echoes: [false, false],
      values: ['?', '?'],
    },
    ...overrides,
  });

  it('accumulates numeric ranks for importance and momentum', () => {
    const accumulator = { ...baseAccumulator, importance: 10, momentum: 20 };
    const item = createMemberVotes({
      atomised: {
        importance: { echo: false, rank: 5, summary: 5, voteProp: 'importance' },
        momentum: { echo: false, rank: 5, summary: 5, voteProp: 'momentum' },
      },
      summary: { echoes: [false, false], values: [5] }
    });

    const result = reduceTaskVotes(accumulator, item);

    expect(result.importance).toBe(15);
    expect(result.momentum).toBe(25);
  });

  it('accumulates abstained and awaiting counts', () => {
    const accumulator = { ...baseAccumulator, abstained: 1, awaiting: 2 };
    const item = createMemberVotes({
      summary: {
        echoes: [],
        values: ['A', '?'], // One abstained, one awaiting
      }
    });

    const result = reduceTaskVotes(accumulator, item);

    expect(result.abstained).toBe(2);
    expect(result.awaiting).toBe(3);
  });

  it('accumulates echoes', () => {
    const accumulator = { ...baseAccumulator, echoes: 5 };
    const item = createMemberVotes({
      atomised: {
        importance: { echo: true, rank: undefined, summary: '?', voteProp: 'importance' },
        momentum: { echo: true, rank: undefined, summary: '?', voteProp: 'momentum' },
      }
    });

    const result = reduceTaskVotes(accumulator, item);

    expect(result.echoes).toBe(7); // 5 + 2
  });

  it('calculates mean correctly', () => {
    const accumulator = { ...baseAccumulator, mean: 10 };
    const item = createMemberVotes({
      summary: {
        echoes: [],
        values: [10, 20], // Mean is 15
      }
    });

    const result = reduceTaskVotes(accumulator, item);
    expect(result.mean).toBe(25);
  });

  it('handles undefined accumulator values', () => {
    const accumulator: TaskVotes = {
      abstained: 0,
      awaiting: 0,
      echoes: 0,
      importance: undefined,
      momentum: undefined,
      mean: undefined,
    };
    const item = createMemberVotes({
      atomised: {
        importance: { echo: false, rank: 5, summary: 5, voteProp: 'importance' },
        momentum: { echo: false, rank: undefined, summary: '?', voteProp: 'momentum' },
      },
      summary: { echoes: [], values: [5] }
    });

    const result = reduceTaskVotes(accumulator, item);

    expect(result.importance).toBe(5);
    expect(result.momentum).toBeUndefined();
    expect(result.mean).toBe(5);
  });
});
