import z from "zod";
import {
  qualityReportCategorySchema,
  qualityReportCoverageSchema,
  qualityReportLintSchema
} from "./base";

const qualityReportCategoryEntries = qualityReportCategorySchema.def.entries;

export const qualityReportAnalysisSchema = z.object({
  [qualityReportCategoryEntries.coverage]: qualityReportCoverageSchema.optional(),
  [qualityReportCategoryEntries.dead]: z.boolean().optional(),
  [qualityReportCategoryEntries.lint]: qualityReportLintSchema.default('ok'),
});
export type QualityReportAnalysis = z.infer<typeof qualityReportAnalysisSchema>;

export const qualityReportAnalysesSchema = z.record(
  z.string(), qualityReportAnalysisSchema.extend({
    updated: z.string()
  })
).default({}).describe('Each configured analysis should put its data here.');
