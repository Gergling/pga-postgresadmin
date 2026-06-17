import { Temporal } from "@js-temporal/polyfill";
import { temporalCodec } from "@/shared/lib/temporal";
import { getScoringKey, QualityReport, qualityReportSchema, QualityReportScore, qualityReportScoreSchema, QualityReportScoring } from "./schemas";
import { Transformer } from "./types";

// export const transformReport = (data: QualityReport) => {
//   const report = qualityReportSchema.parse(data);
// };

export const transformQualityReportMetadata = (data: QualityReport) => {
  const { meta: { last } } = data;
  const started = temporalCodec.decode(last.started).zonedDateTime;
  const ended = temporalCodec.decode(last.ended).zonedDateTime;
  const isRunning = Temporal.ZonedDateTime.compare(started, ended) === 1;
  return { started, ended, isRunning };
};

// Note that dimensional aggregations and filters will be required.
// Metadata:
  // Whether the report is still running (generated empty with a start after the end). So basically a status of idle or running at any given time.
// Aggregations:
  // file-level coverage per total lines in file.
// Filters:
  // File-level specified function(s) cannot be in dead list.
  // File-level architecture updates that have changed since the last report.


export const transformQualityReportScoring: Transformer = (report) => {
  Object.entries(report.files).reduce((files, [path, file]) => {
    // Config structure:
    // {
    //   analysis: 'unit-test',
    //   category: 'coverage',
    //   priority: 'highlight',
    //   paths: [
    //     'src/**/utilities/**/*.ts',
    //     'src/**/utilities/*.ts',
    //     'src/**/utilities.ts',
    //   ],
    // }
    // Match the file path with the glob.
    // Since analysis, category and priority will ultimately want to be optional,
    // it's better to do this here when we aggregate the scores.
    Object.entries(file.lines).reduce((lines, [line, lineData]) => {
      Object.entries(lineData.analyses).reduce(
        (analyses, [analysisName, analysisData]) => {
        const { category, priority } = analysisData;
        const key = getScoringKey({ category, priority });
        // if (category && priority) {
        return {
          ...analyses,
          [key]: {
            ...analyses[key],
            value: analyses[key].value + 1,
          },
        };
      }, file.scores);
    }, file.lines);
    // TODO: After completion, the matrix values should be divided by the number of lines for the file scores.
    // file.analyses
    return {
      ...files,
      [path]: {
        ...file,
        scores: {
        },
      },
    }
  }, report.files);
  // Aggregate the line data to the file level.
  // Add the analysis
  return report;
};
