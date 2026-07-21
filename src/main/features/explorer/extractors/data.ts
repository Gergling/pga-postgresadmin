import path from 'path';
import { stat } from 'fs/promises';
import { access, constants } from 'node:fs';
import { FileExistanceStatus } from '@/shared/features/explorer';

export const extractFileMetadata = async (targetPath: string) => {
  const fileStats = await stat(targetPath);
  const name = path.basename(targetPath);
  const parentPath = path.dirname(targetPath);
  const isDirectory = fileStats.isDirectory();
  const isFile = fileStats.isFile();
  return {
    blockSize: fileStats.blksize,
    blocks: fileStats.blocks,
    isDirectory,
    isFile,
    name,
    parentPath,
    size: fileStats.size,
  };
};

export const extractFileStatus = (
  path: string
) => new Promise<FileExistanceStatus>((resolve) => {
  access(path, constants.F_OK, (err) => {
    if (err) {
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
        return resolve('absent');
      }
      return resolve('locked');
    }
    return resolve('exists');
  });
});
