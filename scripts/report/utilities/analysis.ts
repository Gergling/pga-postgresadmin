import {
  AnalysisConfig,
  AnalysisFunction,
  AnalysisFunctionParams,
  ExtractionFunction,
  ExtractionFunctionParams,
} from "../schemas";
// import { AnalysisFunctionFactory } from "./types";

// type X = ()

// We need to pull the config into the extraction, and then pass it into the
// mergeReportFactory to load the setAnalysis function with the config, such
// as the name and priority.

// Analysis calls this: analysisFactory(/** the type check function `fn` */)
// Extract calls this:
  // const { setAnalysis } = mergeReportFactory({ ...report, files });
// Extract calls this: fn({ setAnalysis, task });

// >(extractor: (
//   ...args: (AnalysisFunctionParams & { config: AnalysisConfig<T> })[]
// ) => Promise<void> | void) => {
export const analysisFactory = <
  T extends object = object
>(extractor: (
  ...args: (AnalysisFunctionParams & { config: AnalysisConfig<T> })[]
) => Promise<void> | void) => {
  // Plugs into the config.
  return (config: AnalysisConfig<T>): AnalysisFunction => {
    // Pass in the config.
    // Pass in the task/setAnalysis.
    const extract: ExtractionFunction = ({ task, ...props }: ExtractionFunctionParams) => {
      task(`Extracting ${config.name}`, async (taskProps) => extractor({
        config, ...taskProps, ...props,
      }));
    };

    return {
      extract,
      name: config.name,
    };
  };
};
