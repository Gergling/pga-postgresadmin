import path from 'path';
import { Project } from '@/shared/features/projects';

export const transformProjectFromPath = (
  targetPath: string, name: string
): Project => ({ name, path: path.join(targetPath, name) });
