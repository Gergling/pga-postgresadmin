// For git commits and file writes, in order to catch dry runs.
// These functions don't belong in `commands` because not all commands are
// mutations and not all mutations are commands.

import { runGitCommit } from "./commands";
import { getOrchestratorArgs } from "./utilities";

// Some kind of central logging to use [DRY RUN] at the beginning of each line
// would make things "pretty".
export const gitCommitStaged = (commitMessage: string) => {
  const { dryRun } = getOrchestratorArgs();
  if (dryRun) {
    console.log('Commit message output:')
    console.log(commitMessage);
    console.log('No commit was run.')
    return;
  }

  const result = runGitCommit(commitMessage);
  console.log(result);
  // TODO: Update the report once implemented.
};
