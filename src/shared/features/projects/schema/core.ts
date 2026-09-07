import z from 'zod';
import {
  dateSerialisationCodec,
  EnrichedEnvelopeFromCore,
  Envelope,
  EnvelopeFromCore,
  envelopeParserFactory,
  envelopeSchemaFactory,
  parserFactory,
  richDateSchema,
  serialisationDateSchema,
  SerialisationEnvelope
} from '@/shared/schema';
import { Codec, codec } from '@/shared/utilities';

export const projectGitSchema = z.object({
  commitDates: z.array(serialisationDateSchema),
  earliestCommitDate: serialisationDateSchema,
  lastCheck: serialisationDateSchema,
  latestCommitDate: serialisationDateSchema,
  totalStagedFiles: z.number(),
});

const projectGitPropSchema = z.union([
  projectGitSchema,
  z.literal(false),
]).optional();

export const projectSchema = z.object({
  name: z.string(), // TODO: Include project code
  path: z.string(), // TODO: Support .optional()
  // Undefined means it isn't yet known whether the project has a git repo.
  // False means it explicitly doesn't.
  // Otherwise we expect to know all the git information we can get hold of.
  git: projectGitPropSchema,
});

export type Project = z.infer<typeof projectSchema>;
/**
 * @deprecated use Project instead.
 */
export type ProjectSchema = Project;

const projectRendererGitSchema = projectGitSchema.extend({
  commitDates: z.array(richDateSchema),
  earliestCommitDate: richDateSchema,
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

export type EnrichedProject = z.infer<typeof projectRendererSchema>;
/**
 * @deprecated use EnrichedProject instead.
 */
export type ProjectRenderer = EnrichedProject;

const projectGitCodec = z.codec(
  projectGitPropSchema,
  projectRendererGitPropSchema,
  {
    decode: (value) => {
      if (value === false) return 'none';
      if (value === undefined) return 'unknown';
      const commitDates = value.commitDates.map(
        (serialisedDate) => dateSerialisationCodec.decode(serialisedDate)
      );
      return {
        ...value,
        commitDates,
        earliestCommitDate: dateSerialisationCodec
          .decode(value.earliestCommitDate),
        lastCheck: dateSerialisationCodec.decode(value.lastCheck),
        latestCommitDate: dateSerialisationCodec.decode(value.latestCommitDate),
      };
    },
    encode: (value) => {
      if (value === 'none') return false;
      if (value === 'unknown') return undefined;
      const lastCheck = serialisationDateSchema.parse(value.lastCheck);
      const latestCommitDate = serialisationDateSchema
        .parse(value.latestCommitDate);
      const commitDates = value.commitDates.map(
        (zdt) => serialisationDateSchema.parse(zdt)
      );
      const earliestCommitDate = serialisationDateSchema
        .parse(value.earliestCommitDate);
      return {
        ...value,
        commitDates,
        earliestCommitDate,
        lastCheck,
        latestCommitDate,
      };
    },
  }
);

export const projectCodec = codec<EnrichedProject, Project>(
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

// export const projectParser = envelopeParserFactory({
//   fallback: projectSchema.parse({}),
//   dataSchema: projectSchema
// });

const envelopeSchemaFactory2 = <T extends z.ZodRawShape>(
  shape: T
) => {
  const core = z.object(shape);
  const audit = core.partial();

  // COuld try outputting a complete envelope schema from here.
  // Also could try outputting the parsing function.
  // This would potentially limit the "intermediate" steps, since the main
  // things we want are a) the envelope schema and type, b) the core type,
  // c) the parsing function... maybe that's overkill though, under the
  // circumstances.

  return { audit, core };
}
type EnvelopeSchemaFactory2Helper<T extends z.ZodRawShape> = ReturnType<
  typeof envelopeSchemaFactory2<T>
>;
type EnvelopeFactory2Helper<T extends z.ZodRawShape> = {
  schema: {
    audit: EnvelopeSchemaFactory2Helper<T>['audit'];
    core: EnvelopeSchemaFactory2Helper<T>['core'];
  };
  inference: {
    audit: z.infer<EnvelopeSchemaFactory2Helper<T>['audit']>;
    core: z.infer<EnvelopeSchemaFactory2Helper<T>['core']>;
  };
};
const projectProps2 = envelopeSchemaFactory2(projectSchema.shape);
type ProjectSchema2Helped = EnvelopeFactory2Helper<typeof projectSchema.shape>['inference'];

export const serialisedProjectSchema = envelopeSchemaFactory(projectSchema.shape);
export type SerialisedProject = z.infer<typeof serialisedProjectSchema>;

// So, let's talk about envelope enrichment.

// Enriching an envelope is an abstracted process.

// We will need a project codec for the core enrichment.

// Probably needs to be implemented as an override.
const envelopeCodecFactory = <
  EnrichedCore extends object,
  SerialisedCore extends object
>(
  coreCodec: Codec<EnrichedCore, SerialisedCore>,
  auditCodec: Codec<Partial<EnrichedCore>, Partial<SerialisedCore>>
) => codec<
  EnrichedEnvelopeFromCore<EnrichedCore>,
  EnvelopeFromCore<SerialisedCore>
>({
  decode: (value) => {
    const audit = value.audit.map(({ data, updated }) => ({
      data: auditCodec.decode(data),
      updated: dateSerialisationCodec.decode(updated)
    }));
    const created = dateSerialisationCodec.decode(value.created);
    const data = coreCodec.decode(value.data);
    return { ...value, audit, created, data };
  },
  encode: (value) => {
    const audit = value.audit.map(({ data, updated }) => ({
      data: auditCodec.encode(data),
      updated: dateSerialisationCodec.encode(updated)
    }));
    const created = dateSerialisationCodec.encode(value.created);
    const data = coreCodec.encode(value.data);
    return { ...value, audit, created, data };
  },
});

const projectAuditCodec = codec<
  Partial<EnrichedProject>, Partial<Project>
>({
  decode: ({ name, path, ...props }) => {
    if (props.git === undefined) return { name, path };
    const git = projectGitCodec.decode(props.git);
    return { name, path, git };
  },
  encode: ({ name, path, git }) => {
    if (git === undefined) return { git: undefined, name, path };
    return { name, path, git: projectGitPropSchema.parse(git) };
  },
});

export const projectEnvelopeCodec = envelopeCodecFactory(
  projectCodec, projectAuditCodec
);

// TODO: The existing envelopeCodecFactory will need to be renamed as a legacy.


// type SerialisedProject = {
//     audit: {
//         data: Record<string, any>; // What. The cuntfuck.
//         updated: {
//             epochMilliseconds: number;
//             timeZoneId: string;
//         };
//     }[];
//     data: {
//         name: string;
//         path: string;
//         git?: false | {
//             commitDates: {
//                 epochMilliseconds: number;
//                 timeZoneId: string;
//             }[];
//             earliestCommitDate: {
//                 epochMilliseconds: number;
//                 timeZoneId: string;
//             };
//             lastCheck: {
//                 epochMilliseconds: number;
//                 timeZoneId: string;
//             };
//             latestCommitDate: {
//                 epochMilliseconds: number;
//                 timeZoneId: string;
//             };
//             totalStagedFiles: number;
//         } | undefined;
//     };
//     created: {
//         epochMilliseconds: number;
//         timeZoneId: string;
//     };
//     id: string;
//     sync?: number | undefined;
// }
