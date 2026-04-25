import { getObjectKeys } from "@shared/utilities/object";
import z from "zod";

// Features, generally found in `**/features/[scope]/**` files.
export const CONVENTIONAL_COMMIT_SCOPE_FEATURES = {
  crm: 'People/company relations management',
  diary: 'Diary entries',
  'job-search': 'Job Search interface',
  projects: 'Project management',
  'user-tasks': 'Task management',
} as const;

// Tech
const CONVENTIONAL_COMMIT_SCOPE_TECH = [
  'electron',
  'firebase',
  'typesaurus',
  'typescript',
  'vite',
] as const;

const CONVENTIONAL_COMMIT_SCOPE_FEATURES_LIST = getObjectKeys(
  CONVENTIONAL_COMMIT_SCOPE_FEATURES
);


export const CONVENTIONAL_COMMIT_SCOPE = [
  ...CONVENTIONAL_COMMIT_SCOPE_FEATURES_LIST,
  ...CONVENTIONAL_COMMIT_SCOPE_TECH,
];

export const CONVENTIONAL_COMMIT_TYPES = {
  fix: 'Patches a bug or equivalent flaw. May fix an error message.',
  tech: "Doesn't fix any bugs or add features.",
  build: `Changes that affect the build system or external dependencies`,
  ci: `Changes that affect the CI configuration files and scripts`,
  docs: 'Documentation only changes',
  feat: 'A new feature',
  perf: 'A code change that improves performance',
  style: 'Changes that do not affect the meaning of the code',
  test: 'Adding missing tests or correcting existing tests',
} as const;

const CONVENTIONAL_COMMIT_TYPES_LIST = getObjectKeys(CONVENTIONAL_COMMIT_TYPES);

export const CONVENTIONAL_COMMIT_MESSAGE_SCHEMA = z.object({
  body: z.string(),
  scope: z.enum([
    ...CONVENTIONAL_COMMIT_SCOPE_FEATURES_LIST,
    ...CONVENTIONAL_COMMIT_SCOPE_TECH
  ]).optional(),
  summary: z.string().max(70),
  type: z.enum(CONVENTIONAL_COMMIT_TYPES_LIST),
});

export type CommitMessage = z.infer<typeof CONVENTIONAL_COMMIT_MESSAGE_SCHEMA>;
