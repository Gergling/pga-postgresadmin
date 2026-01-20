import { describe, it, expect } from 'vitest';
import { reduceProposedTasks, reduceActiveTasks, reduceAbstainedTasks, reduceAwaitingTasks } from './view';
import { UserTask, CouncilMemberNames, TaskVoteBaseNames } from '../../../../shared/features/user-tasks';

describe('view reducers', () => {
  const defaultVotes: Record<CouncilMemberNames, TaskVoteBaseNames> = {
    librarian: 'Awaiting',
    sceptic: 'Awaiting',
    guardian: 'Awaiting',
    strategist: 'Awaiting',
    philosopher: 'Awaiting',
    diplomat: 'Awaiting',
    architect: 'Awaiting',
  };

  const baseTask: UserTask = {
    id: '1',
    description: 'desc',
    summary: 'summary',
    status: 'todo',
    source: 'manual',
    updated: 123,
    votes: {
      importance: { ...defaultVotes },
      momentum: { ...defaultVotes },
    },
    audit: [],
  };

  const createVotes = (vote: string) => {
    const votes = { ...defaultVotes };
    (Object.keys(votes) as CouncilMemberNames[]).forEach(key => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      votes[key] = vote as any;
    });
    return votes;
  };

  describe('reduceProposedTasks', () => {
    it('includes proposed tasks', () => {
      const task: UserTask = { ...baseTask, status: 'proposed' };
      const result = reduceProposedTasks([], task);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
      expect(result[0].view).toBe('edge');
    });

    it('excludes non-proposed tasks', () => {
      const task = { ...baseTask, status: 'todo' } as UserTask;
      const result = reduceProposedTasks([], task);
      expect(result).toHaveLength(0);
    });
  });

  describe('reduceActiveTasks', () => {
    it('includes non-proposed tasks', () => {
      const task = { ...baseTask, status: 'todo' } as UserTask;
      const result = reduceActiveTasks([], task);
      expect(result).toHaveLength(1);
    });

    it('excludes proposed tasks', () => {
      const task = { ...baseTask, status: 'proposed' } as UserTask;
      const result = reduceActiveTasks([], task);
      expect(result).toHaveLength(0);
    });
  });

  describe('reduceAbstainedTasks', () => {
    it('includes tasks with abstained votes > 0', () => {
      const task = {
        ...baseTask,
        votes: {
          ...baseTask.votes,
          importance: createVotes('Abstained'),
        }
      } as UserTask;
      const result = reduceAbstainedTasks([], task);
      expect(result).toHaveLength(1);
    });

    it('excludes tasks with abstained votes === 0', () => {
      const task = {
        ...baseTask,
        votes: {
          importance: createVotes('Awaiting'),
          momentum: createVotes('Awaiting'),
        }
      } as UserTask;
      const result = reduceAbstainedTasks([], task);
      expect(result).toHaveLength(0);
    });
  });

  describe('reduceAwaitingTasks', () => {
    it('includes tasks with awaiting votes > 0', () => {
      const task = {
        ...baseTask,
        votes: {
          importance: createVotes('Awaiting'),
          momentum: createVotes('Balanced'),
        }
      } as UserTask;
      const result = reduceAwaitingTasks([], task);
      expect(result).toHaveLength(1);
    });

    it('excludes tasks with awaiting votes === 0', () => {
      const task = {
        ...baseTask,
        votes: {
          importance: createVotes('Critical'),
          momentum: createVotes('Balanced'),
        }
      } as UserTask;
      const result = reduceAwaitingTasks([], task);
      expect(result).toHaveLength(0);
    });
  });
});
