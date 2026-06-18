import path from 'path';
import { stat } from 'fs/promises';

export const extractFileMetadata = async (targetPath: string) => {
  const fileStats = await stat(targetPath);
  const name = path.basename(targetPath);
  const parentPath = path.dirname(targetPath);
  const isDirectory = fileStats.isDirectory();
  const isFile = fileStats.isFile();
  return {
    isDirectory,
    isFile,
    name,
    parentPath,
  };
};