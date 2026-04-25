import zod from 'zod';

export const PROJECT_SCHEMA = zod.object({
  name: zod.string(),
  path: zod.string(),
  // Undefined means it isn't yet known whether the project has a git repo.
  // False means it explicitly doesn't.
  // Otherwise we expect to know all the git information we can get hold of.
  git: zod.union([
    zod.object({
      lastCheck: zod.iso.datetime(),
      latestCommitDate: zod.iso.datetime(),
      totalStagedFiles: zod.number(),
    }),
    zod.literal(false),
  ]).optional(),
});

export type ProjectSchema = zod.infer<typeof PROJECT_SCHEMA>;
