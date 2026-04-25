/**
 * Commit messages should be generated in the format described by these types.
 */

// Features, generally found in `**/features/[scope]/**` files.
const CONVENTIONAL_COMMIT_SCOPE_FEATURES = [
  'crm', // People/company relations management
  'diary', // Diary entries
  'job-search', // Job Search interface
  'projects', // Project management
  'user-tasks', // Task management
] as const;

// Tech
const CONVENTIONAL_COMMIT_SCOPE_TECH = [
  'electron',
  'firebase',
  'typesaurus',
  'typescript',
  'vite',
] as const;

export const CONVENTIONAL_COMMIT_SCOPE = [
  ...CONVENTIONAL_COMMIT_SCOPE_FEATURES,
  ...CONVENTIONAL_COMMIT_SCOPE_TECH,
];

// Scopes are usually feature-oriented, but also include tech-stack related
// things.
type CommitMessageScope =
  | typeof CONVENTIONAL_COMMIT_SCOPE_FEATURES[number]
  | typeof CONVENTIONAL_COMMIT_SCOPE_TECH[number]
;

/**
 * This is the conventional commit type. Each type has an application based on
 * the apparent *point* of the changes made.
 */
const CONVENTIONAL_COMMIT_TYPES = [
  /**
   * Patches a bug or equivalent flaw. May fix an error message.
   */
  'fix',

  /**
   * Doesn't fix any bugs or add features.
   */
  'tech',

  /**
   * Changes that affect the build system or external dependencies (example
   * scopes: gulp, broccoli, npm)
   */
  'build',

  /**
   * Changes that affect the CI configuration files and scripts (example
   * scopes: Travis, Circle, BrowserStack, SauceLabs)
   */
  'ci',

  /**
   * Documentation only changes
   */
  'docs',

  /**
   * A new feature
   */
  'feat',

  /**
   * A code change that improves performance
   */
  'perf',

  /**
   * Changes that do not affect the meaning of the code (white-space,
   * formatting, missing semi-colons, etc)
   */
  'style',

  /**
   * Adding missing tests or correcting existing tests
   */
  'test',
] as const;

export type CommitMessage = {
  /**
   * Pertinent details regarding the changes.
   */
  body: string;

  /**
   * If applicable, choose a suitable scope.
   */
  scope?: CommitMessageScope;

  /**
   * The commit message summary should ideally not exceed 70 characters and
   * should use imperative mood (“Add…”, “Fix…”, “Refactor…”).
   */
  summary: string;

  type: typeof CONVENTIONAL_COMMIT_TYPES[number];
};
