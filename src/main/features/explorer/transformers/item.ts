import { join } from 'path';
import { analyseSourceFileName } from './analysers';

export const transformFileNodeItem = (
  {
    isDirectory, isFile, name,
  }: {
    isDirectory: boolean; isFile: boolean; name: string;
  }, targetPath: string
) => {
  const absolutePath = join(targetPath, name);
  const { testFileName, ...fileNameAnalysis } = analyseSourceFileName(name);
  const isTsSourceFile = isFile && fileNameAnalysis.isTsSourceFile;
  const isTsTestFile = isFile && fileNameAnalysis.isTsTestFile;

  return {
    name,
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
  };
};
