import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ORCHESTRATOR_COMMANDS, OrchestratorCommand } from './config';
import { showCommands } from './stdio';
import { OrchestratorArgs } from './types';

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

export function getOrchestratorArgs(): OrchestratorArgs {
  const args = process.argv.slice(2); // skip node + script path
  const hasArgs = args.length !== 0;

  if (!hasArgs) return {
    dryRun: false,
    hasArgs,
    isValidOperation: false,
    operation: null,
  };

  const operation = args[0] as OrchestratorCommand;
  const dryRun = args.includes('--dry-run');

  if (ORCHESTRATOR_COMMANDS.includes(operation)) return {
    dryRun,
    hasArgs,
    isValidOperation: true,
    operation,
  };

  return {
    dryRun,
    hasArgs,
    isValidOperation: false,
    operation,
  };
}

export function getCommandFromArgs(): OrchestratorCommand | null {
  const {
    isValidOperation,
    hasArgs,
    operation,
  } = getOrchestratorArgs();

  if (!hasArgs) {
    console.log("No command provided.\n");
    showCommands();
    return null;
  }

  if (!isValidOperation) {
    console.log(`Unknown command: ${operation}\n`);
    showCommands();
    return null;
  }

  return operation;
}

