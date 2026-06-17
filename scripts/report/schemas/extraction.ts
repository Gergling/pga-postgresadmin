import z from "zod";
import { setAnalysisSchema } from "./config";
import { Task } from "tasuku";

export const extractionFunctionParamsSchema = z.object({
  setAnalysis: setAnalysisSchema,
  task: z.custom<Task>(
    (val) => val !== null && typeof val === 'function' && 'group' in val,
    "Invalid Tasuku Task instance"
  ),
});

export type ExtractionFunctionParams = z.infer<
  typeof extractionFunctionParamsSchema
>;

export const extractionFunctionSchema = z.function({
  input: z.array(extractionFunctionParamsSchema)
});

export type ExtractionFunction = z.infer<typeof extractionFunctionSchema>;
