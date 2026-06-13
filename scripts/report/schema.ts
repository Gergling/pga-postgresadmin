import { Temporal } from '@js-temporal/polyfill';
import z from 'zod';
import { zodDeepPartial } from "zod-deep-partial";

export const getNow = () => Temporal.Now.zonedDateTimeISO().toString();

const qualityReportCategorySchema = z.enum(['coverage', 'dead', 'lint']);
// type QualityReportCategory = z.infer<typeof qualityReportCategorySchema>;
const qualityReportCategoryEntries = qualityReportCategorySchema.def.entries;

// const qualityReportPriorityTypeSchema = z
//   .enum(['highlight', 'default', 'mute'])
//   .describe('Can be set against the file level (via globbing) to describe certain types of quality aggregation.');
const qualityReportCoverageTypeSchema = z.enum(['unit', 'component', 'integration']);

const qualityReportLintSchema = z.enum(['ok', 'info', 'warn', 'error']);
export type QualityReportLint = z.infer<typeof qualityReportLintSchema>;

const qualityReportCoverageSchema = z.object({
  // hasTestFile: z.boolean(),
  // hasTests: z.boolean(),
  // TODO: Statements, branches, etc.
  // TODO: Also type of test, e.g. unit, integration.
  type: qualityReportCoverageTypeSchema,
}).describe(
  'Data around test coverage, including unit, component, integration, etc.'
);

export const qualityReportAnalysisSchema = z.object({
  [qualityReportCategoryEntries.coverage]: qualityReportCoverageSchema.optional(),
  [qualityReportCategoryEntries.dead]: z.boolean().optional(),
  [qualityReportCategoryEntries.lint]: qualityReportLintSchema.default('ok'),
});

export type QualityReportAnalysis = z.infer<typeof qualityReportAnalysisSchema>;

const qualityReportAnalysesSchema = z.record(
  z.string(), qualityReportAnalysisSchema.extend({
    updated: z.string()
  })
).default({}).describe('Each configured analysis should put its data here.');

const qualityReportLineSchema = z.object({
  analyses: qualityReportAnalysesSchema,
  git: z.union([
    z.literal('none'),
    z.literal('unknown'),
    z.object({
      lastCommitDate: z.string(),
    })
  ]).default('unknown'),
  line: z.number(),
}).describe('Line-level data.');

export type QualityReportLine = z.infer<typeof qualityReportLineSchema>;

const architectureTypeSchema = z.enum(['commentary', 'deviations']);

const architectureSchema = z.object({
  content: z.string().default(''),
  type: architectureTypeSchema,
  updated: z.string(), // temporalCodec.encode to store, ideally should
  // validate to something or whatever
});

const qualityReportFileSchema = z.object({
  analyses: qualityReportAnalysesSchema,
  architecture: z.record(architectureTypeSchema, architectureSchema).default(
    () => architectureTypeSchema.options.reduce((acc, type) => ({
      ...acc,
      [type]: architectureSchema.parse({ type, updated: getNow() }),
    }), {} as Record<string, z.infer<typeof architectureSchema>>)
  ).optional(),
  lines: z.record(z.number(), qualityReportLineSchema).default({}),
  importMap: z.array(z.string())
    .describe('An array of file paths imported by this file.').default([]),
  structure: z.object({
    name: z.string(),
    parentPath: z.string(),
    path: z.string(),
    type: z.enum(['directory', 'file']),
  }).describe('Data about the file structure.'),
  // summary: z.object({
  //   [qualityReportCategoryEntries.coverage]: z.record(
  //     qualityReportCoverageTypeSchema, qualityReportCoverageSchema
  //   ).optional(), // Possibly needs a special file-level coverage aggregation.
  //   // Can/should be aggregated by type
  //   [qualityReportCategoryEntries.dead]: z.object({
  //     exports: z.number().describe('Names the unused exports in the file.'),
  //   }).optional(),
  //   [qualityReportCategoryEntries.lint]: z.object({
  //     circular: z.string()
  //       .describe('This is a simple array of circular dependency file paths associated with this file.'),
  //     lines: qualityReportLintSchema,
  //   }).optional(),
  // }).optional().describe('Summarises anything from the line-level data.'),
});

export type QualityReportFile = z.infer<typeof qualityReportFileSchema>;
const deepPartialQualityReportFileSchema = zodDeepPartial(qualityReportFileSchema);
export type DeepPartialQualityReportFile = z.infer<typeof deepPartialQualityReportFileSchema>;

export const qualityReportSchema = z.object({
  files: z.record(z.string(), qualityReportFileSchema).default({})
    .describe('File-level data, in which the file path should act as the key.'),
  meta: z.object({
    last: z.object({
      started: z.string(),
      ended: z.string(),
    }),
  }).default(() => ({ last: {
    started: getNow(),
    ended: getNow(),
  } })).describe('Data about the report.'),
  // summary: {
  //   process: {
  //     git: {
  //       tracked: 0,
  //       dirty: 0,
  //     },
  //   },
  //   quality: {
  //     coverage: {
  //       hasTestFile: false,
  //       hasTests: false,
  //     },
  //     lint: {
  //       circular: {},
  //       dry: {},
  //       violations: {},
  //     },
  //     live: {
  //       exports: 0,
  //       files: 0,
  //     },
  //   },
  //   meta: {
  //     total: 0,
  //   },
  // },
});


export type QualityReport = z.infer<typeof qualityReportSchema>;
const deepPartialQualityReportSchema = zodDeepPartial(qualityReportSchema);
export type DeepPartialQualityReport = z.infer<typeof deepPartialQualityReportSchema>;
