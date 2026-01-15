import { describe, it, expect } from 'vitest';
import { COUNCIL_MEMBER } from '../config';
import { AtomicVote, AtomicVoteValueSummary, CouncilMemberAtomisedVotes, CouncilMemberNames } from '../types';
import { createMemberVotes, getCouncilMemberScores, getCouncilMemberVoteValue } from './votes-council';

describe('votes-council', () => {
  const createAtomicVote = (
    member: CouncilMemberNames,
    voteProp: 'importance' | 'momentum',
    rank: number | undefined,
    summary: AtomicVoteValueSummary,
    echo = false
  ): AtomicVote => ({
    member,
    voteProp,
    rank,
    summary,
    echo,
  });

  describe('createMemberVotes', () => {
    it('initializes all council members with "Awaiting"', () => {
      const votes = createMemberVotes();

      COUNCIL_MEMBER.forEach((member) => {
        expect(votes[member.id]).toBe('Awaiting');
      });

      expect(Object.keys(votes)).toHaveLength(COUNCIL_MEMBER.length);
    });
  });

  describe('getCouncilMemberVoteValue', () => {
    const createAtomisedVotes = (
      importanceSummary: AtomicVoteValueSummary,
      momentumSummary: AtomicVoteValueSummary,
      importanceEcho = false,
      momentumEcho = false
    ): CouncilMemberAtomisedVotes => ({
      importance: {
        echo: importanceEcho,
        rank: typeof importanceSummary === 'number' ? importanceSummary : undefined,
        summary: importanceSummary,
        voteProp: 'importance',
      },
      momentum: {
        echo: momentumEcho,
        rank: typeof momentumSummary === 'number' ? momentumSummary : undefined,
        summary: momentumSummary,
        voteProp: 'momentum',
      },
    });

    it('returns mean value when all votes are numeric', () => {
      const atomised = createAtomisedVotes(10, 20);
      const result = getCouncilMemberVoteValue(atomised);
      expect(result.values).toEqual([15]);
      expect(result.echoes).toEqual([false, false]);
    });

    it('returns single value when votes are identical numbers', () => {
      const atomised = createAtomisedVotes(10, 10);
      const result = getCouncilMemberVoteValue(atomised);
      expect(result.values).toEqual([10]);
    });

    it('returns single value when votes are identical strings', () => {
      const atomised = createAtomisedVotes('?', '?');
      const result = getCouncilMemberVoteValue(atomised);
      expect(result.values).toEqual(['?']);
    });

    it('returns all values when votes are different strings', () => {
      const atomised = createAtomisedVotes('?', 'A');
      const result = getCouncilMemberVoteValue(atomised);
      expect(result.values).toEqual(['?', 'A']);
    });

    it('returns all values when votes are mixed numeric and string', () => {
      const atomised = createAtomisedVotes(10, '?');
      const result = getCouncilMemberVoteValue(atomised);
      expect(result.values).toEqual([10, '?']);
    });

    it('correctly extracts echo flags', () => {
      const atomised = createAtomisedVotes(10, 20, true, false);
      const result = getCouncilMemberVoteValue(atomised);
      expect(result.echoes).toEqual([true, false]);
    });
  });

  describe('getCouncilMemberScores', () => {
    it('calculates mean score when both votes are numeric', () => {
      const votes: AtomicVote[] = [
        createAtomicVote('librarian', 'importance', 10, 10),
        createAtomicVote('librarian', 'momentum', 20, 20),
      ];

      const result = getCouncilMemberScores(votes);
      const librarian = result.map.librarian;

      expect(librarian.summary.values).toEqual([15]); // (10 + 20) / 2
      expect(librarian.atomised.importance.rank).toBe(10);
      expect(librarian.atomised.momentum.rank).toBe(20);
    });

    it('returns a single value when both votes are identical strings', () => {
      const votes: AtomicVote[] = [
        createAtomicVote('sceptic', 'importance', undefined, '?'),
        createAtomicVote('sceptic', 'momentum', undefined, '?'),
      ];

      const result = getCouncilMemberScores(votes);
      const sceptic = result.map.sceptic;

      expect(sceptic.summary.values).toEqual(['?']);
    });

    it('returns both values when votes are different strings', () => {
      const votes: AtomicVote[] = [
        createAtomicVote('guardian', 'importance', undefined, '?'),
        createAtomicVote('guardian', 'momentum', undefined, 'A'),
      ];

      const result = getCouncilMemberScores(votes);
      const guardian = result.map.guardian;

      expect(guardian.summary.values).toEqual(['?', 'A']);
    });

    it('returns both values when one is numeric and one is string', () => {
      const votes: AtomicVote[] = [
        createAtomicVote('strategist', 'importance', 5, 5),
        createAtomicVote('strategist', 'momentum', undefined, '?'),
      ];

      const result = getCouncilMemberScores(votes);
      const strategist = result.map.strategist;

      expect(strategist.summary.values).toEqual([5, '?']);
    });

    it('aggregates echo flags correctly', () => {
      const votes: AtomicVote[] = [
        createAtomicVote('philosopher', 'importance', undefined, '?', true),
        createAtomicVote('philosopher', 'momentum', undefined, '?', false),
      ];

      const result = getCouncilMemberScores(votes);
      const philosopher = result.map.philosopher;

      expect(philosopher.summary.echoes).toEqual([true, false]);
    });

    it('handles multiple council members correctly', () => {
      const votes: AtomicVote[] = [
        createAtomicVote('librarian', 'importance', 10, 10),
        createAtomicVote('librarian', 'momentum', 10, 10),
        createAtomicVote('sceptic', 'importance', undefined, '?'),
        createAtomicVote('sceptic', 'momentum', undefined, 'A'),
      ];

      const result = getCouncilMemberScores(votes);

      expect(result.map.librarian.summary.values).toEqual([10]);
      expect(result.map.sceptic.summary.values).toEqual(['?', 'A']);
      
      // Check list structure
      const librarianInList = result.list.find(m => m.member === 'librarian');
      expect(librarianInList).toBeDefined();
      expect(librarianInList?.summary.values).toEqual([10]);
    });

    it('correctly structures the atomised votes in the result', () => {
      const votes: AtomicVote[] = [
        createAtomicVote('diplomat', 'importance', 8, 8),
        createAtomicVote('diplomat', 'momentum', 6, 6),
      ];

      const result = getCouncilMemberScores(votes);
      const diplomat = result.map.diplomat;

      expect(diplomat.atomised.importance).toEqual({
        echo: false,
        rank: 8,
        summary: 8,
        voteProp: 'importance',
      });
      expect(diplomat.atomised.momentum).toEqual({
        echo: false,
        rank: 6,
        summary: 6,
        voteProp: 'momentum',
      });
    });

    it('returns undefined in the map for members with no votes', () => {
      // If no votes are passed, the map will be empty, but the list will map undefineds if we aren't careful.
      // However, the current implementation iterates COUNCIL_MEMBER to build the list.
      // If the map entry is missing, it will be undefined in the list.
      const result = getCouncilMemberScores([]);
      
      expect(result.map.librarian).toBeUndefined();
      expect(result.list[0]).toBeUndefined();
    });
  });
});
