import { Dirent } from 'fs';
import { Optional, Swap } from '@/shared/types';
import { DirentSummary } from '@/shared/features/explorer';
import { join } from 'path';
import { analyseSourceFileName } from './analysers';

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
    const { testFileName, ...fileNameAnalysis } = analyseSourceFileName(name);
    const isTsSourceFile = isFile && fileNameAnalysis.isTsSourceFile;
    const isTsTestFile = isFile && fileNameAnalysis.isTsTestFile;

    acc.set(absolutePath, {
      name: entry.name,
      absolutePath,
      meta: {
        isDirectory,
        isFile,
        isTsSourceFile,
        isTsTestFile,
        testFileName,
      },
      options: {
        expand: isDirectory,
      },
      status: {
        locks: [],
      },
    });

    return acc;
  },
  new Map<string, DirentTransformation>()
);
