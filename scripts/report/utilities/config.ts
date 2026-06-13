import { Task } from "tasuku";
import z from "zod";
import { qualityReportAnalysisSchema } from "../schema";

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

export const analysisFunctionSchema = z.function({ input: z.array(z.object({
  setAnalysis: setAnalysisSchema,
  task: z.custom<Task>(
    (val) => val !== null && typeof val === 'function' && 'group' in val,
    "Invalid Tasuku Task instance"
  ),
})) });

export type AnalysisFunction = z.infer<typeof analysisFunctionSchema>;

export const configParamsSchema = z.object({
  analyses: z.array(analysisFunctionSchema).default([]),
  paths: z.object({
    base: z.string(),
    report: z.string(),
  }).default({ base: './', report: 'quality-analysis.json' }),
});

export type ConfigParams = z.infer<typeof configParamsSchema>;

export const createQualityReportConfig = (
  props: ConfigParams
) => configParamsSchema.parse(props);
