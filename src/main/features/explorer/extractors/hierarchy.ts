import { readdir } from 'fs/promises';
import { DirentSummary } from '@/shared/features/explorer';
import { isTestableFile, transformDirent } from '../transformers';

/**
 * Lists all shallow files and folders within a given directory path.
 * @param targetPath The absolute or relative path to scan.
 */
export async function listContents(targetPath: string): Promise<DirentSummary[]> {
  try {
    const entries = await readdir(targetPath, { withFileTypes: true });

    const map = transformDirent(entries, targetPath);

    return [...map.values()].map((summary) => {
      const { meta: { isTsSourceFile, testFileName } } = summary;
      const hasTestFile = !!(testFileName && map.get(testFileName));
      const testable = isTestableFile(isTsSourceFile, hasTestFile);
      return {
        ...summary,
        options: {
          ...summary.options,
          testable,
        },
      }
    });
  } catch (error) {
    throw new Error(`Failed to scan directory at "${targetPath}": ${(error as Error).message}`);
  }
}
