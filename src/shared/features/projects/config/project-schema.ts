import z from 'zod';
import {
  dateSerialisationCodec,
  richDateSchema,
  serialisationDateSchema
} from '@/shared/schema';

export const projectGitSchema = z.object({
  lastCheck: serialisationDateSchema,
  latestCommitDate: serialisationDateSchema,
  totalStagedFiles: z.number(),
});

const projectGitPropSchema = z.union([
  projectGitSchema,
  z.literal(false),
]).optional();

export const projectSchema = z.object({
  name: z.string(),
  path: z.string(),
  // Undefined means it isn't yet known whether the project has a git repo.
  // False means it explicitly doesn't.
  // Otherwise we expect to know all the git information we can get hold of.
  git: projectGitPropSchema,
});

export type ProjectSchema = z.infer<typeof projectSchema>;

const projectRendererGitSchema = projectGitSchema.extend({
  lastCheck: richDateSchema,
  latestCommitDate: richDateSchema,
});

export type ProjectRendererGit = z.infer<typeof projectRendererGitSchema>;

const projectRendererGitPropSchema = z.union([
  projectRendererGitSchema,
  z.literal('none'),
  z.literal('unknown'),
]);

export const projectRendererSchema = projectSchema.extend({
  git: projectRendererGitPropSchema,
});

export type ProjectRenderer = z.infer<typeof projectRendererSchema>;

const projectGitCodec = z.codec(
  projectGitPropSchema,
  projectRendererGitPropSchema,
  {
    decode: (value) => {
      if (value === false) return 'none';
      if (value === undefined) return 'unknown';
      return {
        ...value,
        lastCheck: dateSerialisationCodec.decode(value.lastCheck),
        latestCommitDate: dateSerialisationCodec.decode(value.latestCommitDate),
      };
    },
    encode: (value) => {
      if (value === 'none') return false;
      if (value === 'unknown') return undefined;
      const lastCheck = serialisationDateSchema.parse(value.lastCheck);
      const latestCommitDate = serialisationDateSchema.parse(value.latestCommitDate);
      return {
        ...value,
        lastCheck,
        latestCommitDate,
      };
    },
  }
);

export const projectCodec = z.codec(
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
      const git = projectGitPropSchema.parse(value.git);
      return {
        ...value,
        git,
      };
    },
  }
);
