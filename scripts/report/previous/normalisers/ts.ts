import ts from 'typescript';
import * as path from 'path';
import { NormalisedReport, ReportAggregatorNormaliser, VisibilityStatus } from '../aggregator/types';
import { normalizeAndRelativizePath } from '../aggregator/utilities/path';

/**
 * Normalizes TypeScript compilation errors into the NormalisedReport format.
 * It identifies all source files included in the tsconfig and checks for semantic errors.
 *
 * @returns A NormalisedReport object highlighting files with TypeScript errors.
 */
export const normaliseTypeScriptErrors = <AggregationName extends string>(

): ReportAggregatorNormaliser<AggregationName> => ({
  getNormalisedVisibility,
  getStatusScore,
}): NormalisedReport<AggregationName> => {
  // TODO: Take into account the production excluded files and highlight
  // everything else. Anything from the production tsconfig that has an
  // error will fail the build.
  const configFilePath = './tsconfig.production.json';
  const report: NormalisedReport<AggregationName> = {};
  const absoluteConfigPath = path.resolve(configFilePath);
  const configDir = path.dirname(absoluteConfigPath);

  // 1. Read and parse the tsconfig file
  const configFileText = ts.sys.readFile(absoluteConfigPath);
  if (!configFileText) {
      console.error(`ERROR: Could not read tsconfig file at ${absoluteConfigPath}`);
      return report;
  }

  const { config, error: jsonError } = ts.parseConfigFileTextToJson(absoluteConfigPath, configFileText);
  if (jsonError) {
      // console.error('ERROR parsing tsconfig JSON:', ts.formatDiagnostic(jsonError));
      console.error('ERROR parsing tsconfig JSON', jsonError);
      return report;
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
  for (const sourceFile of program.getSourceFiles()) {
    const filePath = normalizeAndRelativizePath(sourceFile.fileName);

    if (filePath.startsWith('node_modules/')) continue;

    // Skip declaration files (*.d.ts) which are usually external libraries
    if (filePath.endsWith('.d.ts')) {
      continue;
    }

    // Get semantic diagnostics (type checking errors) for the file
    const semanticDiagnostics = program.getSemanticDiagnostics(sourceFile);

    // Determine the file-level status based on whether errors exist
    const hasErrors = semanticDiagnostics.length > 0;
    const isSanityPath = filePath.startsWith('sanity-studio/');
    const status: VisibilityStatus = isSanityPath ? 'default' : 'highlight';

    // Add the file to the report
    // TODO: A function could be passed into this to simply put in the src, status and line data.
    // That would make the extraction code less complex on the normaliser level.
    report[filePath] = {
      src: filePath,
      // Use 'ts-errors' as the aggregation name
      visibility: getNormalisedVisibility(status) as Record<AggregationName, VisibilityStatus>,
      lines: [
        getStatusScore(hasErrors ? 0 : 1) as Record<AggregationName, number>
      ], // Simplified line status for this task
    };

    if (hasErrors) {
      console.log(`[Error Found] ${path.basename(filePath)} has ${semanticDiagnostics.length} type errors.`);
    }
  }

  return report;
}
