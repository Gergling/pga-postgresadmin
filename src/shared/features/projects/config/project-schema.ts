import zod from 'zod';
import { temporalCodec, temporalSchema } from '@/shared/lib/temporal';

export const projectGitSchema = zod.object({
  lastCheck: zod.string(),
  latestCommitDate: zod.string(),
  totalStagedFiles: zod.number(),
});

const projectGitPropSchema = zod.union([
  projectGitSchema,
  zod.literal(false),
]).optional();

export const projectSchema = zod.object({
  name: zod.string(),
  path: zod.string(),
  // Undefined means it isn't yet known whether the project has a git repo.
  // False means it explicitly doesn't.
  // Otherwise we expect to know all the git information we can get hold of.
  git: projectGitPropSchema,
});

/**
 * @deprecated Use projectSchema instead.
 * @alias projectSchema
 */
export const PROJECT_SCHEMA = projectSchema;

export type ProjectSchema = zod.infer<typeof projectSchema>;

const projectRendererGitSchema = zod.object({
  ...projectGitSchema.shape,
  lastCheck: temporalSchema,
  latestCommitDate: temporalSchema,
});

const projectRendererGitPropSchema = zod.union([
  projectRendererGitSchema,
  zod.literal('none'),
  zod.literal('unknown'),
]);

export const projectRendererSchema = zod.object({
  ...projectSchema.shape,
  git: projectRendererGitPropSchema,
});

export type ProjectRenderer = zod.infer<typeof projectRendererSchema>;

const projectGitCodec = zod.codec(
  projectGitPropSchema,
  projectRendererGitPropSchema,
  {
    decode: (value) => {
      if (value === false) return 'none';
      if (value === undefined) return 'unknown';
      return {
        ...value,
        lastCheck: temporalCodec.decode(value.lastCheck),
        latestCommitDate: temporalCodec.decode(value.latestCommitDate),
      };
    },
    encode: (value) => {
      if (value === 'none') return false;
      if (value === 'unknown') return undefined;
      return {
        ...value,
        lastCheck: temporalCodec.encode(value.lastCheck),
        latestCommitDate: temporalCodec.encode(value.latestCommitDate),
      };
    },
  }
);

export const projectCodec = zod.codec(
  projectSchema,
  projectRendererSchema,
  {
    decode: (props) => {
      const git = projectGitCodec.decode(props.git);
      return {
        ...props,
        git,
      };
    },
    encode: (value) => {
      const git = projectGitCodec.encode(value.git);
      return {
        ...value,
        git,
      };
    },
  }
);
