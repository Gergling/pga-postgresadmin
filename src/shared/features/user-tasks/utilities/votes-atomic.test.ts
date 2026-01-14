import { describe, it, expect } from 'vitest';
import { COUNCIL_MEMBER } from '../config';
import { TASK_VOTE_PROPS } from '../constants';
import { CouncilMemberNames, TaskVoteBase, UserTask } from '../types';
import { atomiseVotes, getAtomicVote } from './votes-atomic';

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

  describe('getAtomicVote', () => {
    it('returns the current vote value correctly', () => {
      const result = getAtomicVote(mockTask, 'librarian', 'importance');
      expect(result).toEqual({
        member: 'librarian',
        voteProp: 'importance',
        value: 'Critical',
        echo: 'Legacy',
      });
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
      expect(result.value).toBe('Awaiting');
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
      expect(librarianImportance?.value).toBe('Critical');
      expect(librarianImportance?.echo).toBe('Legacy');

      const scepticMomentum = result.find(v => v.member === 'sceptic' && v.voteProp === 'momentum');
      expect(scepticMomentum).toBeDefined();
      expect(scepticMomentum?.value).toBe('Balanced');
      expect(scepticMomentum?.echo).toBe('Propulsive');

      const guardianImportance = result.find(v => v.member === 'guardian' && v.voteProp === 'importance');
      expect(guardianImportance).toBeDefined();
      expect(guardianImportance?.value).toBe('Awaiting');
      expect(guardianImportance?.echo).toBeUndefined();
    });
  });
});