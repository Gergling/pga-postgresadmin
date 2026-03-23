import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ORCHESTRATOR_COMMANDS, OrchestratorCommand } from './config';
import { showCommands } from './stdio';

export const getFileContents = (path: string) => readFileSync(
  resolve(path), 'utf-8'
);

export const getTsSourceFileContents = (path: string) => {
  const contents = getFileContents(path);
  return [
    ['Here is the contents of the source file `', path, '`:'].join(''),
    '```ts',
    contents,
    '```',
  ].join('\n');
};

/**
 * Extracts raw code from a Markdown fenced code block.
 * Handles both "```ts" and "```tsx" prefixes.
 */
export const extractRawCode = (markdownResponse: string): string => {
  // Regex explanation:
  // ^```[a-z]*\n  -> Matches opening backticks + optional language name + newline
  // ([\s\S]*?)    -> Captures everything inside (non-greedy)
  // \n```         -> Matches newline + closing backticks
  const regex = /^```(?:ts|tsx|typescript)?\n([\s\S]*?)\n```/m;
  const match = markdownResponse.match(regex);

  if (match && match[1]) {
    return match[1].trim();
  }

  // Fallback: If no code block found, return original trimmed string
  return markdownResponse.trim();
}

export function getCommandFromArgs(): OrchestratorCommand | null {
  const args = process.argv.slice(2); // skip node + script path

  if (args.length === 0) {
    console.log("No command provided.\n");
    showCommands();
    return null;
  }

  const cmd = args[0] as OrchestratorCommand;

  if (ORCHESTRATOR_COMMANDS.includes(cmd)) return cmd;

  console.log(`Unknown command: ${cmd}\n`);
  showCommands();
  return null;
}
