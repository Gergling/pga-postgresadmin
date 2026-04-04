import { CommitMessage } from "./types";

export const concatenateCommitMessage = (
  { body, scope, summary, type }: CommitMessage
): string => `${type}${scope ? `(${scope})` : ''}: ${summary}\n\n${body}`;
