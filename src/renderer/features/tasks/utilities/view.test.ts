import { describe, it, expect, vi, beforeEach } from 'vitest';
import { reduceProposedTasks, reduceActiveTasks, reduceAbstainedTasks, reduceAwaitingTasks } from './view';
import { UserTask, TaskVotes } from '../../../../shared/features/user-tasks';
import { getVoteScores } from '../../../../shared/features/user-tasks';

// Mock the module that exports getVoteScores to control the scores returned
vi.mock('../../../../shared/features/user-tasks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../shared/features/user-tasks')>();
  return {
    ...actual,
    getVoteScores: vi.fn(),
  };
});


describe('view reducers', () => {
  const mockGetVoteScores = getVoteScores as unknown as ReturnType<typeof vi.fn>;

  const baseTask: UserTask = {
    id: '1',
    description: 'desc',
    summary: 'summary',
    status: 'todo',
    source: 'manual',
    updated: 123,
    votes: {} as any,
    audit: [],
  };

  const zeroScores: TaskVotes = {
    abstained: 0,
    awaiting: 0,
    importance: 0,
    momentum: 0,
    mean: 0,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Default to zero scores unless specified
    mockGetVoteScores.mockReturnValue(zeroScores);
  });

  describe('reduceProposedTasks', () => {
    it('includes proposed tasks', () => {
      const task = { ...baseTask, status: 'proposed' } as UserTask;
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
      mockGetVoteScores.mockReturnValue({ ...zeroScores, abstained: 1 });
      const task = { ...baseTask } as UserTask;
      const result = reduceAbstainedTasks([], task);
      expect(result).toHaveLength(1);
    });

    it('excludes tasks with abstained votes === 0', () => {
      mockGetVoteScores.mockReturnValue({ ...zeroScores, abstained: 0 });
      const task = { ...baseTask } as UserTask;
      const result = reduceAbstainedTasks([], task);
      expect(result).toHaveLength(0);
    });
  });

  describe('reduceAwaitingTasks', () => {
    it('includes tasks with awaiting votes > 0', () => {
      mockGetVoteScores.mockReturnValue({ ...zeroScores, awaiting: 1 });
      const task = { ...baseTask } as UserTask;
      const result = reduceAwaitingTasks([], task);
      expect(result).toHaveLength(1);
    });

    it('excludes tasks with awaiting votes === 0', () => {
      mockGetVoteScores.mockReturnValue({ ...zeroScores, awaiting: 0 });
      const task = { ...baseTask } as UserTask;
      const result = reduceAwaitingTasks([], task);
      expect(result).toHaveLength(0);
    });
  });
});
