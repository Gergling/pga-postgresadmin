import { exec } from 'node:child_process';
import util from 'node:util';
import { errorSchema } from '@/shared/schema/error';
import { LogApi } from '@/main/shared';

const executeCommand = util.promisify(exec);

/**
 * Runs a `git diff --cached --unified=0` to get the staged files.
 * @returns string[]: An array of staged file paths.
 */
export const fetchStagedFileList = async (cwd: string): Promise<string[]> => {
  try {
    const { stderr, stdout } = await executeCommand(
      "git diff --cached --name-only",
      { cwd, encoding: "utf8" }
    );
    if (stderr) {
      console.error('Error at cwd:', cwd);
      console.error(stderr);
      throw new Error(stderr);
    }
    return stdout.split("\n").filter(Boolean);
  } catch (error) {
    console.error('Error fetching staged file list:', cwd, error);
    throw error;
  }
}
export const fetchStagedFileContents = async (
  cwd: string, { log }: LogApi
): Promise<string[]> => log(
  `Fetching staged file contents: ${cwd}`,
  async ({ setMessage }) => {
    try {
      const { stderr, stdout } = await executeCommand(
        "git diff --cached --unified=0",
        { cwd, encoding: "utf8" }
      );
      if (stderr) {
        setMessage(`Error fetching staged file contents: ${stderr}`);
        throw new Error(stderr);
      }
      return stdout.split("\n");
    } catch (error) {
      setMessage(errorSchema.parse(error));
      throw error;
    }
  }
);

/**
 * Runs a git commit -m
 * @param cwd Working directory.
 * @param message Commit message.
 * @returns 
 */
export const runGitCommit = (
  cwd: string,
  message: string
) => executeCommand(`git commit -m"${message}"`, { cwd, encoding: 'utf-8' });

/**
 * Gets the most recent commit date for the repository at the specified path.
 * @param cwd Working directory.
 * @returns Promise<Date>
 */
export const fetchLatestCommitDate = async (cwd: string): Promise<Date> => {
  try {
    const { stdout } = await executeCommand(
      'git log -1 --format=%cI',
      { cwd, encoding: 'utf8' }
    );
    return new Date(stdout.trim());
  } catch (error) {
    console.error('Error fetching latest commit date at cwd:', cwd);
    throw error;
  }
};
