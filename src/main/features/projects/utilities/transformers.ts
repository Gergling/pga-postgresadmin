import path from 'path';
import { Project } from '@/shared/features/projects';

export const transformProjectFromPath = (
  targetPath: string, name: string
): Project => ({ name, path: path.join(targetPath, name) });

export const transformProjectGitCommitDateActivity = (dates: string[]) => {
  // Convert into probably zdt.
  // Run through recency calculations.
  // Can score based on 1 commit in the last 24 hours OR more than one commit
  // in the last 3 days for the "recent" point.
  // Score at least one more in the last week (no overlap). Scoring multiple is better.
  // Score 0, 1 or 1+ last 30 days.
  // 0, 1 or 1+ last 90 days.
  // Otherwise score 0.
};

