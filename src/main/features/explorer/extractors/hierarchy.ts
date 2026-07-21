import path from 'path';
import { readdir, stat } from 'fs/promises';
import {
  DirentSummary,
  FileNodeData,
} from '@/shared/features/explorer';
import { parseError } from '@/shared/schema/error';
import { getPathData, log, LogApi } from '@/main/shared';
import {
  isTestableFile,
  transformDirent,
  transformFileNodeItem
} from '../transformers';
import { extractFileMetadata } from './data';
import { upsertExplorerFileRecords } from '../crud';

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
export async function listContents(
  targetPath: string, { log }: LogApi
): Promise<DirentSummary[]> {
  // Need to guard against non-directory paths.
  return log(`Listing contents for ${targetPath}`, async (logApi) => {
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
      const e = parseError(error);
      if (e.scope.type === 'file' && e.scope.path) {
        const { parentPath, name } = getPathData(e.scope.path);
        await upsertExplorerFileRecords(
          { parentPath, name }, { action: 'skip' }, logApi
        );
        logApi.setStatus(
          'warning', `Skipping ${e.scope.path} - permission denied.`
        );
        return [];
      }
      throw new Error(`Failed to scan directory at "${targetPath}": ${e.text}`);
    }
  });
}

export async function readFileNode(targetPath: string, { log }: LogApi): Promise<FileNodeData> {
  const result = await log(
    `Reading file node data for ${targetPath}`,
    async (props) => {
      // TODO: This is a good time to check the DB for this path.
      // We want a function which gets the information from the database if
      // recent.
      // Where the DB is (sufficiently, probably over an hour) old, the
      // function should update the action:
      // If there is sufficient resource, it can trigger the "targeted"
      // explorer. Otherwise, set the action to 'review'. The routine process
      // can run against the 'review' records on its schedule.
      // If it doesn't exist, we have to run the targeted explorer. That process
      // should start with a simple metadata extraction for whether it's a leaf
      // or directory, then behave accordingly. Once the data is available,
      // update the db and send back via the IPC.

      // Each path expects to have this data:
      // {
      //     absolutePath: string;
      //     meta: {
      //         isDirectory: boolean;
      //         isFile: boolean;
      //         isTsSourceFile: boolean;
      //         isTsTestFile: boolean;
      //         testFileName?: string | undefined;
      //     };
      //     name: string;
      //     options: {
      //         expand: boolean;
      //         testable: FileUnitTestOperation;
      //     };
      //     status: {
      //         locks: LockingProcess[];
      //     };
      // }  
      // Locking isn't worth caching.
      // Unit test operation can be inferred from the existence of the
      // source and test files, which can be inferred from the file names.
      // So actually, we don't need any of this.
      const { log } = props;
      const current = await log(
        'Reading metadata for path',
        () => extractFileNodeData(targetPath)
      );

      const parentPath = path.dirname(targetPath);
      const parent = await log(
        'Reading metadata for parent',
        () => extractFileNodeData(parentPath)
      );

      const children = await log(
        'Reading metadata for children',
        (props) => listContents(targetPath, props)
      );

      return {
        children,
        current,
        parent,
      };
    }
  );

  return result;
}
