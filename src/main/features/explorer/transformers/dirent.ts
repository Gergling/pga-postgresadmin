import { Dirent } from 'fs';
import { join } from 'path';
import { Optional, Swap } from '@/shared/types';
import { DirentSummary } from '@/shared/features/explorer';
import { transformFileNodeItem } from './item';

type DirentTransformation = Swap<
  DirentSummary, 'options', Optional<DirentSummary['options'], 'testable'>
>;

export const transformDirent = (
  entries: Dirent<string>[], targetPath: string
) => entries.reduce(
  (acc, entry) => {
    const isDirectory = entry.isDirectory();
    const isFile = entry.isFile();

    // We only care about directories and files.
    if (!isDirectory && !isFile) return acc;

    const { name } = entry;
    const absolutePath = join(targetPath, name);
    return acc.set(absolutePath, transformFileNodeItem({
      isDirectory, isFile, name
    }, targetPath));
  },
  new Map<string, DirentTransformation>()
);
