import { execSync } from 'node:child_process';

export const fetchUnusedFiles = () => execSync(
  'knip --files --production --no-exit-code',
  { encoding: 'utf-8' }
).split(/\r?\n/)
  .map(s => s.trim())
  .filter(Boolean);

/**
 * Runs a `git diff --cached --name-only` to get the staged files.
 * @returns string[]: An array of staged file paths.
 */
export const fetchStagedFiles = (): string[] => {
  const output = execSync("git diff --cached --unified=0", {
    encoding: "utf8",
  });
  return output.split("\n").filter(Boolean);
}

/**
 * 
 * @param message Runs a git commit -m
 * @returns 
 */
export const runGitCommit = (
  message: string
) => execSync(`git commit -m"${message}"`, {
  encoding: 'utf-8'
});
