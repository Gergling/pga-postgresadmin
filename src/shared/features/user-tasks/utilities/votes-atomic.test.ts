import { describe, it, expect } from 'vitest';
import { COUNCIL_MEMBER } from '../config';
import { TASK_VOTE_PROPS } from '../constants';
import { CouncilMemberNames, TaskVoteBase, UserTask } from '../types';
import { atomiseVotes, getAtomicVote, getEchoVote } from './votes-atomic';

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

  describe('getAtomicVote', () => {
    it('returns the current vote value correctly', () => {
      const result = getAtomicVote(mockTask, 'librarian', 'importance');
      expect(result).toEqual(expect.objectContaining({
        member: 'librarian',
        voteProp: 'importance',
        vote: 'Critical',
        echo: 'Legacy',
      }));
      // rank should match the mapping
      expect(result.rank).toBeDefined();
    });

    it('returns the echo vote from audit if present', () => {
      const result = getAtomicVote(mockTask, 'librarian', 'importance');
      expect(result.echo).toBe('Legacy');
    });

    it('skips "Awaiting" votes in audit when finding echo', () => {
      // Sceptic momentum:
      // Current: Balanced
      // Audit[0]: Awaiting (from defaultVotes)
      // Audit[1]: Propulsive
      const result = getAtomicVote(mockTask, 'sceptic', 'momentum');
      expect(result.echo).toBe('Propulsive');
    });

    it('returns undefined for echo if no non-awaiting vote is found in audit', () => {
      const result = getAtomicVote(mockTask, 'guardian', 'importance');
      expect(result.echo).toBeUndefined();
      expect(result.vote).toBe('Awaiting');
    });

    it('handles missing votes in audit gracefully', () => {
      const partialAuditTask: UserTask = {
        ...mockTask,
        audit: [
          { ...mockTask.audit[0], votes: undefined },
          { ...mockTask.audit[1] }
        ]
      };
      const result = getAtomicVote(partialAuditTask, 'sceptic', 'momentum');
      expect(result.echo).toBe('Propulsive');
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
      expect(librarianImportance?.vote).toBe('Critical');
      expect(librarianImportance?.echo).toBe('Legacy');

      const scepticMomentum = result.find(v => v.member === 'sceptic' && v.voteProp === 'momentum');
      expect(scepticMomentum).toBeDefined();
      expect(scepticMomentum?.vote).toBe('Balanced');
      expect(scepticMomentum?.echo).toBe('Propulsive');

      const guardianImportance = result.find(v => v.member === 'guardian' && v.voteProp === 'importance');
      expect(guardianImportance).toBeDefined();
      expect(guardianImportance?.vote).toBe('Awaiting');
      expect(guardianImportance?.echo).toBeUndefined();
    });
  });
});