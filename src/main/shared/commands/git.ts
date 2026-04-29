import { exec } from 'node:child_process';
import util from 'node:util';

const executeCommand = util.promisify(exec);

export const isGitRepository = async (cwd: string): Promise<boolean> => {
  try {
    await executeCommand(
      "git rev-parse --is-inside-work-tree",
      { cwd, encoding: "utf8" }
    );
    return true;
  } catch (error) {
    return false;
  }
}
