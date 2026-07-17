import * as path from 'node:path';

export const normalizeAndRelativizePath = (
  absolutePath: string,
  rootDir: string = process.cwd()
): string => {
  if (!absolutePath) {
    return '';
  }

  const posixPath = absolutePath.replace(/\\/g, '/');
  const relativePath = path.relative(rootDir, posixPath);
  return relativePath.replace(/\\/g, '/');
};

export const getPathData = (absolutePath: string) => ({
  name: path.basename(absolutePath),
  parentPath: path.dirname(absolutePath),
});
