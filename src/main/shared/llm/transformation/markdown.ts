/**
 * Extracts raw code from a Markdown fenced code block.
 * Handles both "```ts" and "```tsx" prefixes.
 */
export const transformMarkdown = (markdownResponse: string): string => {
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
