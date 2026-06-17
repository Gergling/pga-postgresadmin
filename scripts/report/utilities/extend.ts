import { deepMerge } from "./";
import {
  AnalysisConfig,
  DeepPartialQualityReport,
  DeepPartialQualityReportFile,
  ExtractionFunction,
  getNow,
  QualityReport,
  QualityReportAnalysis,
  qualityReportSchema
} from "../schemas";

type ExcludeFilesKeyExplicitly = Exclude<keyof QualityReport, 'files'>;
type FilesRecord = DeepPartialQualityReport['files'];

type MergeReportPayload = DeepPartialQualityReport | {
  type: ExcludeFilesKeyExplicitly;
  value: DeepPartialQualityReport[ExcludeFilesKeyExplicitly];
} | ({
  type: 'files';
} & (
  {
    path?: never;
    value: FilesRecord;
  } | {
    path: string;
    value: DeepPartialQualityReportFile;
  }
))
// & (
//   {
//     fileProp?: never;
//     value: FilesRecord;
//   } | (
//     {
//       fileProp: Exclude<keyof QualityReportFile, 'structure'>;
//       value: QualityReportFile[keyof QualityReportFile];
//     }
//   )
// ));

export const mergeReport = (
  report: QualityReport,
  payload: MergeReportPayload,
): QualityReport => {
  // Check if it's a wholeass quality report.
  if (!('type' in payload)) {
    // Check if it has files and check they exist.
    if (payload.files) {
      const files = Object.keys(payload.files).reduce((acc, path) => {
        if (!report.files[path]) {
          console.warn(`Attempted to update file at "${path}" but it is not included in the report.`);
          return acc;
        }
        return {
          ...acc,
          [path]: report.files[path],
        };
      }, {} as FilesRecord);

      return qualityReportSchema.parse(
        deepMerge<QualityReport>(report, { files })
      );
      throw new Error('Thrown.');
    }

    // If not, just merge.
    return qualityReportSchema.parse(
      deepMerge(report, payload)
    );
  }

  // Otherwise, check the type.
  if (payload.type !== 'files') return qualityReportSchema.parse(
    deepMerge(report, { [payload.type]: payload.value })
  );

  if (!payload.path) return qualityReportSchema.parse(
    deepMerge(report, { files: payload.value })
  );

  if (!report.files[payload.path]) throw new Error([
    'Merge report failed:',
    payload.path,
    'does not exist.'
  ].join(' '));

  return qualityReportSchema.parse(
    deepMerge(report, { files: { [payload.path]: payload.value } })
  );
};

type MergeReportFactoryParams = {
  analysis: QualityReportAnalysis;
  line?: number;
  name: string;
  path: string;
};

export type SetAnalysis = (params: MergeReportFactoryParams) => QualityReport;

export const mergeReportFactory = (
  base: QualityReport
) => {
  const setAnalysis: SetAnalysis = ({ analysis, line, name, path }) => {
    const analyses = { [name]: { updated: getNow(), ...analysis } };
    if (line === undefined) {
      base = mergeReport(base, {
        type: 'files', path, value: { analyses },
      });
      return base;
    }

    base = qualityReportSchema.parse(
      deepMerge(base, { files: { [path]: { lines: { [line]: { analyses }}} } })
    );
    return base;
  };

  return { base, setAnalysis };
};
