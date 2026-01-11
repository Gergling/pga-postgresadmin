import { describe, it, expect } from 'vitest';
import { CouncilMemberVotes, TaskVotes } from './types';
import { reduceTaskVotes } from './utilities';

describe('reduceTaskVotes', () => {
  it('correctly sums values when all properties are present', () => {
    const accumulator: TaskVotes = {
      abstained: 1,
      awaiting: 2,
      importance: 10,
      momentum: 20,
      mean: 15,
    };

    const item: CouncilMemberVotes = {
      member: 'Librarian',
      abstained: 1,
      awaiting: 0,
      importance: 5,
      momentum: 5,
      mean: 5,
    };

    const result = reduceTaskVotes(accumulator, item);

    expect(result).toEqual({
      abstained: 2,
      awaiting: 2,
      importance: 15,
      momentum: 25,
      mean: 20,
    });
  });

  it('handles undefined values in the accumulator', () => {
    const accumulator: TaskVotes = {
      abstained: 0,
      awaiting: 0,
      importance: undefined,
      momentum: undefined,
      mean: undefined,
    };

    const item: CouncilMemberVotes = {
      member: 'Librarian',
      abstained: 1,
      awaiting: 1,
      importance: 10,
      momentum: 10,
      mean: 10,
    };

    const result = reduceTaskVotes(accumulator, item);

    expect(result).toEqual({
      abstained: 1,
      awaiting: 1,
      importance: 10,
      momentum: 10,
      mean: 10,
    });
  });

  it('handles undefined values in the item', () => {
    const accumulator: TaskVotes = {
      abstained: 5,
      awaiting: 5,
      importance: 50,
      momentum: 50,
      mean: 50,
    };

    const item: CouncilMemberVotes = {
      member: 'Librarian',
      abstained: 0,
      awaiting: 0,
      importance: undefined,
      momentum: undefined,
      mean: undefined,
    };

    const result = reduceTaskVotes(accumulator, item);

    expect(result).toEqual({
      abstained: 5,
      awaiting: 5,
      importance: 50,
      momentum: 50,
      mean: 50,
    });
  });

  it('returns undefined for optional properties if both accumulator and item are undefined', () => {
    const accumulator: TaskVotes = {
      abstained: 0,
      awaiting: 0,
      importance: undefined,
      momentum: undefined,
      mean: undefined,
    };

    const item: CouncilMemberVotes = {
      member: 'Librarian',
      abstained: 0,
      awaiting: 0,
      importance: undefined,
      momentum: undefined,
      mean: undefined,
    };

    const result = reduceTaskVotes(accumulator, item);

    expect(result).toEqual({
      abstained: 0,
      awaiting: 0,
      importance: undefined,
      momentum: undefined,
      mean: undefined,
    });
  });

  it('treats missing abstained or awaiting in item as 0 to avoid NaN', () => {
    const accumulator: TaskVotes = {
      abstained: 10,
      awaiting: 20,
      importance: 10,
      momentum: 10,
      mean: 10,
    };

    const item = {
      member: 'Librarian',
      importance: 5,
      momentum: 5,
      mean: 5,
    } as unknown as CouncilMemberVotes;

    const result = reduceTaskVotes(accumulator, item);

    expect(result.abstained).toBe(10);
    expect(result.awaiting).toBe(20);
  });
});