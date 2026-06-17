import ts from 'typescript';
import * as path from 'path';
import { normalizeAndRelativizePath } from '@/main/shared/file/path';
import {
  DeepPartialQualityReport,
  QualityReportLine,
  QualityReportLint
} from '../schemas';
import { analysisFactory } from '../utilities/analysis';

const getLintCategory = (category: ts.DiagnosticCategory): QualityReportLint => {
  switch (category) {
    case ts.DiagnosticCategory.Error:
      return 'error';
    case ts.DiagnosticCategory.Warning:
      return 'warn';
    case ts.DiagnosticCategory.Message:
    case ts.DiagnosticCategory.Suggestion:
      return 'info';
    default:
      return 'ok';
  }
};

/**
 * Normalizes TypeScript compilation errors into the NormalisedReport format.
 * It identifies all source files included in the tsconfig and checks for semantic errors.
 *
 * @returns A NormalisedReport object highlighting files with TypeScript errors.
 */
export const typeCheck = analysisFactory<{ configFilePath?: string; }>(({
  config: { custom: { configFilePath = './tsconfig.json' } },
  setAnalysis, // TODO: This is the "meat" of the operation instead of a return.
  // TODO: Analysis factory should accept a function that returns a promise, including rejection on failure.
  // task // TODO: This can be removed and better logging implemented instead.
  setError, // TODO: Implement this and use it instead of the existing error
  // logs.
  // setProgress, // TODO: Implement instead of logging.
  // TODO: Analysis factory can wrap in a function and log accordingly regardless.
}): Promise<void> | void => {
  // TODO: Take into account the production excluded files and highlight
  // everything else. Anything from the production tsconfig that has an
  // error will fail the build.
  // const configFilePath = './tsconfig.json';
  // const report: NormalisedReport<AggregationName> = {};
  const absoluteConfigPath = path.resolve(configFilePath);
  const configDir = path.dirname(absoluteConfigPath);

  // 1. Read and parse the tsconfig file
  const configFileText = ts.sys.readFile(absoluteConfigPath);
  if (!configFileText) {
    setError(`ERROR: Could not read tsconfig file at ${absoluteConfigPath}`);
    console.error(`ERROR: Could not read tsconfig file at ${absoluteConfigPath}`);
    // return report;
    // return {};
    return;
  }

  // setProgress('Parsing tsconfig.json');

  const { config, error: jsonError } = ts.parseConfigFileTextToJson(
    absoluteConfigPath, configFileText
  );
  if (jsonError) {
    // console.error('ERROR parsing tsconfig JSON:', ts.formatDiagnostic(jsonError));
    setError(`ERROR parsing tsconfig JSON: ${jsonError}`);
    console.error('ERROR parsing tsconfig JSON', jsonError);
    // return report;
    // return {};
    return;
  }

  // 2. Resolve 'extends', 'include', and 'exclude'
  const parsedCommandLine = ts.parseJsonConfigFileContent(config, ts.sys, configDir);

  if (parsedCommandLine.errors.length > 0) {
    console.warn('TS Config Warnings/Errors encountered during parsing (will continue compilation):');
    // parsedCommandLine.errors.forEach(err => console.warn(ts.formatDiagnostic(err)));
    parsedCommandLine.errors.forEach(err => console.warn(err));
  }

  // 3. Create the Program (the heart of the compilation context)
  // We pass only the config options and the root files
  const program = ts.createProgram({
    rootNames: parsedCommandLine.fileNames,
    options: parsedCommandLine.options,
  });

  // 4. Get all source files and check for semantic diagnostics (type errors)
  const report = program.getSourceFiles().reduce(
    (report, sourceFile): DeepPartialQualityReport => {
      const filePath = normalizeAndRelativizePath(sourceFile.fileName);

      if (filePath.startsWith('node_modules/')) return report;

      // Skip declaration files (*.d.ts) which are usually external libraries
      if (filePath.endsWith('.d.ts')) return report;

      // Get semantic diagnostics (type checking errors) for the file
      const semanticDiagnostics = program.getSemanticDiagnostics(sourceFile);
      const lines = semanticDiagnostics.reduce(
        (acc, { category, file, start }): Partial<QualityReportLine> => {
          if (!category || !file || !start) return acc;

          const {
            line,
            // character
          } = ts.getLineAndCharacterOfPosition(
            file, start
          );

          // The API returns 0-indexed positions. Add 1 for human-readable outputs:
          const humanLine = line + 1;
          // const humanColumn = character + 1;
          const lint = getLintCategory(category);
          return {
            ...acc,
            [humanLine]: {
              lint,
              line: humanLine,
            },
          };
        }, {} as Record<number, Partial<QualityReportLine>>
      );

      // Determine the file-level status based on whether errors exist
      // const hasErrors = semanticDiagnostics.length > 0;
      // const isSanityPath = filePath.startsWith('sanity-studio/');
      // const status: VisibilityStatus = isSanityPath ? 'default' : 'highlight';

      // Add the file to the report
      // TODO: A function could be passed into this to simply put in the src, status and line data.
      // That would make the extraction code less complex on the normaliser level.
      const importMap: string[] = []; // Referenced files should be able to get into here.
      return {
        ...report,
        files: {
          ...report.files,
          [filePath]: {
            importMap,
            lines,
          },
        },
      };
    }, {} as DeepPartialQualityReport
  );

  // return report;
});
