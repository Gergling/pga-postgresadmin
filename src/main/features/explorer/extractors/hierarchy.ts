import path from 'path';
import { readdir, stat } from 'fs/promises';
import task from 'tasuku';
import { DirentSummary, FileNodeData } from '@/shared/features/explorer';
import {
  isTestableFile,
  transformDirent,
  transformFileNodeItem
} from '../transformers';
import { extractFileMetadata } from './data';

const extractFileNodeData = async (targetPath: string): Promise<DirentSummary> => {
  const props = await extractFileMetadata(targetPath);
  const currentNodeItem = transformFileNodeItem(props, targetPath);
  const { meta: { isTsSourceFile, testFileName } } = currentNodeItem;
  const testFileExists = testFileName && (await stat(testFileName)).isFile();
  const hasTestFile = !!(testFileName && testFileExists);
  const testable = isTestableFile(isTsSourceFile, hasTestFile);
  return {
    ...currentNodeItem,
    options: {
      ...currentNodeItem.options,
      testable,
    },
  };
};

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

export async function readFileNode(targetPath: string): Promise<FileNodeData> {
  const { result } = await task(
    `Reading file node data for ${targetPath}`,
    async ({ setError, task }) => {
      try {
        const { result: current } = await task(
          'Reading metadata for path', () => extractFileNodeData(targetPath)
        );

        const parentPath = path.dirname(targetPath);
        const { result: parent } = await task(
          'Reading metadata for parent', () => extractFileNodeData(parentPath)
        );

        const { result: children } = await task(
          'Reading metadata for children', () => listContents(targetPath)
        );

        return {
          children,
          current,
          parent,
        };
      } catch (e) {
        if (e instanceof Error || typeof e === 'string') {
          setError(e);
        } else {
          setError(JSON.stringify(e));
        }
        throw e;
      }
    }
  );

  return result;
}
