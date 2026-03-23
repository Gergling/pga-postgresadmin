import readline from 'node:readline';
import { analyseLanguage } from '@main/features/ai';
import { fetchStagedFiles, runGitCommit } from '../commands';
import { getPromptToGenerateCommitMessage } from '../prompts';

const readlineQuestion = (
  rl: readline.Interface,
  suggestedLine: string
): Promise<string> => new Promise((resolve) => rl.question('> ', updatedLine => {
  if (updatedLine.trim() === "") return resolve(suggestedLine);
  return resolve(updatedLine);
}));

export const commitStagedCode = async () => {
  const stagedFiles = fetchStagedFiles();
  const prompt = getPromptToGenerateCommitMessage(stagedFiles);
  const suggestedCommitMessage = await analyseLanguage(prompt);

  console.log("\nSuggested commit message:");
  console.log("----------------------------------------");
  console.log(suggestedCommitMessage);
  console.log("----------------------------------------");
  console.log("\nEdit each line. Press Enter to accept. Delete all text to remove.\n");

  const suggestedLines = suggestedCommitMessage.split("\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const updatedLines: string[] = [];

  for (const suggestedLine of suggestedLines) {
    rl.write(suggestedLine);
    process.stdout.cursorTo(suggestedLine.length);
    const updatedLine = await readlineQuestion(rl, suggestedLine);
    updatedLines.push(updatedLine);
  }

  rl.close();

  const updatedCommitMessage = updatedLines.join("\n");

  const commitMessage = updatedCommitMessage.trim().length === 0
    ? updatedCommitMessage
    : suggestedCommitMessage
  ;

  // TODO: Skip for --dry-run.
  const result = runGitCommit(commitMessage);
  console.log(result);

  // If the user didn’t type anything, use the initial message
  // if (lines.length === 0) {
  //   return initial;
  // }

  // return lines.join("\n");
};
