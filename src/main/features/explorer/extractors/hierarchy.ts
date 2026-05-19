import { readdir } from 'fs/promises';
import { join } from 'path';
import { DirentSummary } from '@/shared/features/explorer';

/**
 * Lists all shallow files and folders within a given directory path.
 * @param targetPath The absolute or relative path to scan.
 */
export async function listContents(targetPath: string): Promise<DirentSummary[]> {
  try {
    const entries = await readdir(targetPath, { withFileTypes: true });

    return entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
      locks: [],
      absolutePath: join(targetPath, entry.name),
    }));
  } catch (error) {
    throw new Error(`Failed to scan directory at "${targetPath}": ${(error as Error).message}`);
  }
}
