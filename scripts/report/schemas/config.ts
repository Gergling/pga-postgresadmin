import z from "zod";
import { qualityReportAnalysisSchema } from "./analysis";
import {
  qualityReportCategorySchema,
  qualityReportPriorityTypeSchema
} from "./base";
import { Task } from "tasuku";

export const mergeReportFactoryParamsSchema = z.object({
  analysis: qualityReportAnalysisSchema,
  line: z.number().optional(),
  name: z.string(),
  path: z.string(),
});
export type MergeReportFactoryParams = z.infer<
  typeof mergeReportFactoryParamsSchema
>;
export const setAnalysisSchema = z.function({
  input: z.array(mergeReportFactoryParamsSchema)
});

const analysisConfigSchema = z.object({
  name: z.string(),
  priority: z.array(z.object({
    category: qualityReportCategorySchema,
    priority: qualityReportPriorityTypeSchema,
    paths: z.array(z.string()),
  })).default([]),
});

export type AnalysisConfig = z.infer<typeof analysisConfigSchema>;

const analysisFunctionParamsSchema = z.object({
  config: analysisConfigSchema,
  setAnalysis: setAnalysisSchema,
  task: z.custom<Task>(
    (val) => val !== null && typeof val === 'function' && 'group' in val,
    "Invalid Tasuku Task instance"
  ),
});

export type AnalysisFunctionParams = z.infer<
  typeof analysisFunctionParamsSchema
>;

export const analysisFunctionSchema = z.function({
  input: z.array(analysisFunctionParamsSchema)
});

export type AnalysisFunction = z.infer<typeof analysisFunctionSchema>;

const analysisFunctionFactorySchema = z.function({
  input: z.array(analysisConfigSchema),
  // TODO: Output should be an "extract" function...
  output: z.object({
    extract: analysisFunctionSchema,
  }),
});

// type AnalysisFunctionFactory = z.infer<
//   typeof analysisFunctionFactorySchema
// >;

export const configParamsSchema = z.object({
  analyses: z.array(analysisFunctionFactorySchema).default([]),
  paths: z.object({
    base: z.string(),
    report: z.string(),
  }).default({ base: './', report: 'quality-analysis.json' }),
  // TODO: Inclusions/exclusions.
  // TODO: Highlight/mute
  priority: z.array(z.object({
    analysis: z.string(),
    category: qualityReportCategorySchema,
    priority: qualityReportPriorityTypeSchema,
    paths: z.array(z.string()),
  })).default([]),
}).transform((config) => {
  // TODO: Might be worth checking config.priority for conflicts between paths.
  return config;
});

export type ConfigParams = z.infer<typeof configParamsSchema>;
