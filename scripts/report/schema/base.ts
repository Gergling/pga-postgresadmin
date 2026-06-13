import z from "zod";

export const qualityReportCategorySchema = z.enum(['coverage', 'dead', 'lint']);
export type QualityReportCategory = z.infer<typeof qualityReportCategorySchema>;

export const qualityReportPriorityTypeSchema = z
  .enum(['highlight', 'default', 'mute'])
  .describe('Can be set against the file level (via globbing) to describe certain types of quality aggregation.');
export type QualityReportPriorityType = z.infer<typeof qualityReportPriorityTypeSchema>;
// const qualityReportPriorityTypeEntries = qualityReportPriorityTypeSchema.def.entries;

export const qualityReportCoverageTypeSchema = z.enum(['unit', 'component', 'integration']);
export const qualityReportLintSchema = z.enum(['ok', 'info', 'warn', 'error']);
export type QualityReportLint = z.infer<typeof qualityReportLintSchema>;

export const qualityReportCoverageSchema = z.object({
  // hasTestFile: z.boolean(),
  // hasTests: z.boolean(),
  // TODO: Statements, branches, etc.
  // TODO: Also type of test, e.g. unit, integration.
  type: qualityReportCoverageTypeSchema,
}).describe(
  'Data around test coverage, including unit, component, integration, etc.'
);

export const architectureTypeSchema = z.enum(['commentary', 'deviations']);

export const architectureSchema = z.object({
  content: z.string().default(''),
  type: architectureTypeSchema,
  updated: z.string(), // temporalCodec.encode to store, ideally should
  // validate to something or whatever
});
