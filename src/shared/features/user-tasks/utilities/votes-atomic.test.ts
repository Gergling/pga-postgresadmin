import { describe, it, expect } from 'vitest';
import { COUNCIL_MEMBER } from '../config';
import { TASK_VOTE_BASE_SUMMARY_MAP, TASK_VOTE_PROPS } from '../constants';
import { CouncilMemberNames, TaskVoteBase, UserTask } from '../types';
import { atomiseVotes, getAtomicSummary, getAtomicVote, getEchoVote, getMeanAtomicVoteRank } from './votes-atomic';
import { getVoteRank } from './votes-rank';

describe('votes-atomic', () => {
  const defaultVotes: Record<CouncilMemberNames, TaskVoteBase> = {
    librarian: 'Awaiting',
    sceptic: 'Awaiting',
    guardian: 'Awaiting',
    strategist: 'Awaiting',
    philosopher: 'Awaiting',
    diplomat: 'Awaiting',
    architect: 'Awaiting',
  };

  const mockTask: UserTask = {
    id: '1',
    description: 'test',
    summary: 'test',
    status: 'todo',
    source: 'manual',
    updated: 0,
    votes: {
      importance: { ...defaultVotes, librarian: 'Critical' },
      momentum: { ...defaultVotes, sceptic: 'Balanced' },
    },
    audit: [
      {
        votes: {
          importance: { ...defaultVotes, librarian: 'Legacy' },
          momentum: { ...defaultVotes },
        }
      },
      {
        votes: {
          importance: { ...defaultVotes, librarian: 'Awaiting' },
          momentum: { ...defaultVotes, sceptic: 'Propulsive' },
        }
      }
    ]
  };

  describe('getEchoVote', () => {
    it('returns the first non-awaiting vote from the audit history', () => {
      // For librarian/importance, audit[0] is 'Legacy'. The function should find and return it.
      const result = getEchoVote(mockTask, 'librarian', 'importance');
      expect(result).toBe('Legacy');
    });

    it('skips "Awaiting" votes in audit to find the previous value', () => {
      // For sceptic/momentum, audit[0] is 'Awaiting', audit[1] is 'Propulsive'.
      // The function should skip audit[0] and return 'Propulsive' from audit[1].
      const result = getEchoVote(mockTask, 'sceptic', 'momentum');
      expect(result).toBe('Propulsive');
    });

    it('returns undefined if no non-awaiting vote is found in audit', () => {
      // For guardian/importance, all votes in the audit are 'Awaiting'.
      const result = getEchoVote(mockTask, 'guardian', 'importance');
      expect(result).toBeUndefined();
    });

    it('handles missing votes property in an audit entry gracefully', () => {
      const partialAuditTask: UserTask = {
        ...mockTask,
        audit: [
          { votes: undefined }, // This entry should be skipped
          { votes: { importance: defaultVotes, momentum: { ...defaultVotes, sceptic: 'Propulsive' } } },
        ]
      };
      const result = getEchoVote(partialAuditTask, 'sceptic', 'momentum');
      expect(result).toBe('Propulsive');
    });

    it('returns undefined for a task with an empty audit trail', () => {
      const taskWithoutAudit: UserTask = { ...mockTask, audit: [] };
      const result = getEchoVote(taskWithoutAudit, 'librarian', 'importance');
      expect(result).toBeUndefined();
    });
  });

  describe('getAtomicSummary', () => {
    it('returns rank if it is defined', () => {
      const summary = getAtomicSummary(5, 'Critical', 'Critical', 'importance');
      expect(summary).toBe(5);
    });

    it('returns echo rank if rank is undefined and echo is defined', () => {
      const summary = getAtomicSummary(undefined, 'Legacy', 'Awaiting', 'importance');
      const legacyRank = getVoteRank('importance', 'Legacy');
      expect(summary).toBe(legacyRank);
    });

    it('returns base summary if rank and echo are undefined', () => {
      const summary = getAtomicSummary(undefined, undefined, 'Awaiting', 'importance');
      expect(summary).toBe(TASK_VOTE_BASE_SUMMARY_MAP['Awaiting']);
    });

    it('returns base summary for Abstained vote', () => {
      const summary = getAtomicSummary(undefined, undefined, 'Abstained', 'importance');
      expect(summary).toBe(TASK_VOTE_BASE_SUMMARY_MAP['Abstained']);
    });
  });

  describe('getAtomicVote', () => {
    it('returns an atomic vote with rank for a decided vote with an echo', () => {
      const result = getAtomicVote(mockTask, 'librarian', 'importance');
      const rank = getVoteRank('importance', 'Critical');
      expect(result).toEqual({
        member: 'librarian',
        voteProp: 'importance',
        rank,
        summary: rank,
        echo: true, // has an echo vote of 'Legacy'
      });
    });

    it('returns an atomic vote with summary from echo when current vote is awaiting', () => {
      const taskWithAwaiting: UserTask = {
        ...mockTask,
        votes: {
          ...mockTask.votes,
          momentum: { ...defaultVotes, sceptic: 'Awaiting' },
        },
      };
      // echo for sceptic/momentum is 'Propulsive'
      const result = getAtomicVote(taskWithAwaiting, 'sceptic', 'momentum');
      const echoRank = getVoteRank('momentum', 'Propulsive');
      expect(result).toEqual({
        member: 'sceptic',
        voteProp: 'momentum',
        rank: undefined,
        summary: echoRank,
        echo: true,
      });
    });

    it('returns an atomic vote with base summary when vote is awaiting and no echo exists', () => {
      const result = getAtomicVote(mockTask, 'guardian', 'momentum'); // All guardian votes are 'Awaiting'
      expect(result).toEqual({
        member: 'guardian',
        voteProp: 'momentum',
        rank: undefined,
        summary: TASK_VOTE_BASE_SUMMARY_MAP['Awaiting'],
        echo: false,
      });
    });

    it('handles decided vote with no echo', () => {
      const taskWithoutAudit: UserTask = { ...mockTask, audit: [] };
      const result = getAtomicVote(taskWithoutAudit, 'librarian', 'importance');
      const rank = getVoteRank('importance', 'Critical');
      expect(result).toEqual({
        member: 'librarian',
        voteProp: 'importance',
        rank,
        summary: rank,
        echo: false,
      });
    });
  });

  describe('atomiseVotes', () => {
    it('creates an atomic vote for every member and vote property', () => {
      const result = atomiseVotes(mockTask);
      const expectedLength = COUNCIL_MEMBER.length * TASK_VOTE_PROPS.length;
      expect(result).toHaveLength(expectedLength);
    });

    it('correctly maps all votes', () => {
      const result = atomiseVotes(mockTask);

      const librarianImportance = result.find(v => v.member === 'librarian' && v.voteProp === 'importance');
      expect(librarianImportance).toBeDefined();
      const rank = getVoteRank('importance', 'Critical');
      expect(librarianImportance).toEqual({
        echo: true,
        member: 'librarian',
        rank,
        summary: rank,
        voteProp: 'importance',
      });

      const scepticMomentum = result.find(v => v.member === 'sceptic' && v.voteProp === 'momentum');
      expect(scepticMomentum).toBeDefined();
      const scepticRank = getVoteRank('momentum', 'Balanced');
      expect(scepticMomentum).toEqual({
        echo: true,
        member: 'sceptic',
        rank: scepticRank,
        summary: scepticRank,
        voteProp: 'momentum',
      });

      const guardianImportance = result.find(v => v.member === 'guardian' && v.voteProp === 'importance');
      expect(guardianImportance).toBeDefined();
      expect(guardianImportance).toEqual({
        echo: false,
        member: 'guardian',
        rank: undefined,
        summary: TASK_VOTE_BASE_SUMMARY_MAP['Awaiting'],
        voteProp: 'importance',
      });
    });
  });

  describe('getMeanAtomicVoteRank', () => {
    it('calculates the mean of numeric values', () => {
      expect(getMeanAtomicVoteRank([10, 20])).toBe(15);
    });

    it('treats non-numeric values as 0 in the sum but counts them in the count', () => {
      expect(getMeanAtomicVoteRank([10, '?'])).toBe(5);
    });

    it('returns 0 for purely non-numeric values', () => {
      expect(getMeanAtomicVoteRank(['?', 'A'])).toBe(0);
    });

    it('returns NaN for empty array', () => {
      expect(getMeanAtomicVoteRank([])).toBeNaN();
    });
  });
});