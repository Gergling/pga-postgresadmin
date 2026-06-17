import z from "zod";
import { qualityReportAnalysisSchema } from "./analysis";
import {
  qualityReportCategorySchema,
  qualityReportPriorityTypeSchema
} from "./base";
import { Task, TaskInnerAPI } from "tasuku";
import { extractionFunctionParamsSchema, extractionFunctionSchema } from "./extraction";

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
  // custom: z.record(z.string(), z.unknown()).default({}).optional(),
  name: z.string(),
  priority: z.array(z.object({
    category: qualityReportCategorySchema,
    priority: qualityReportPriorityTypeSchema,
    paths: z.array(z.string()),
  })).default([]),
});

export type AnalysisConfig<
  T extends object = object
> = z.infer<typeof analysisConfigSchema> & { custom: T; };

const analysisFunctionParamsSchema = extractionFunctionParamsSchema.extend({
  config: analysisConfigSchema,
  setAnalysis: setAnalysisSchema,
  // setError: z.function({ input: z.array(z.string()) }),
  // setProgress: z.function({ input: z.array(z.string()) }),
  // task: z.custom<Task>(
  //   (val) => val !== null && typeof val === 'function' && 'group' in val,
  //   "Invalid Tasuku Task instance"
  // ),
});

export type AnalysisFunctionParams<
  T extends object = object
> = AnalysisConfig<T> & TaskInnerAPI;
// export type AnalysisFunctionParams<T extends object = object> = z.infer<
//   typeof analysisFunctionParamsSchema
// > & TaskInnerAPI;

const analysisFunctionSchema = z.function({
  input: z.array(analysisFunctionParamsSchema)
});

export type AnalysisFunction = z.infer<typeof analysisFunctionSchema>;

const analysisFunctionFactorySchema = z.function({
  input: z.array(analysisConfigSchema),
  output: z.object({
    extract: extractionFunctionSchema,
  }),
}).describe('Generates analysis functions');

export type AnalysisFunctionFactory<T extends object = object> = (
  ...args: (AnalysisFunctionParams & { config: AnalysisConfig<T> })[]
) => Promise<void> | void;

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
  })).default([]).transform((priority) => {
    // TODO: Might be worth checking config.priority for conflicts between paths.
    return priority;
  }),
});

// TODO: Probably needs some type stuff for the custom config params
export type ConfigParams = z.infer<typeof configParamsSchema>;
