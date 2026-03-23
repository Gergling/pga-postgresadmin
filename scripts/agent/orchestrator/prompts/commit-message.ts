import { getPromptBaseForProjectDevelopment } from "./base";

export const getPromptToGenerateCommitMessage = (
  fileContents: string[]
) => getPromptBaseForProjectDevelopment('commit-messages', [
  'Here are the staged files and their contents:',
  ...fileContents,
]);
