import { readdirSync } from "fs";
import { resolve } from "path";
import { readFileContents } from "@/main/shared/file/contents";
import { fileExists } from "@/main/shared/file/exists";
import { QualityReport, QualityReportFile, qualityReportSchema } from "./schema";
import { normalise } from "./utilities/normalise";
import { mergeReportFactory } from "./utilities";
import { Task } from "tasuku";
import { ConfigParams } from "./utilities/config";

const extractQualityReportData = async (path: string): Promise<unknown> => {
  try {
    // Check whether the file exists.
    // If not, return an empty object.
    const reportExists = await fileExists(path);
    if (!reportExists) return {};
    // If so, read it and load the contents.
    // JSON parse and return.
    const contents = await readFileContents(path);
    return contents;
  } catch (e) {
    console.error('Error extracting report:', e);
    throw e;
  }
};

const extractFileStructureFactory = (
  basePath: string, reportFiles: QualityReport['files']
) => {
  const entries = readdirSync(basePath, { withFileTypes: true });

  const files = entries.reduce((acc, entry): QualityReport['files'] => {
    const { name } = entry;
    const parentPath = normalise(entry.parentPath);
    const path = normalise(parentPath, name);
    const type: QualityReportFile['structure']['type'] | 'unknown'
      = entry.isDirectory() && path.startsWith('src')
        ? 'directory'
        : entry.isFile()
          ? 'file'
          : 'unknown'
    ;

    if (type === 'unknown') return acc;

    const structure = { name, path, parentPath, type };

    const children = type === 'directory'
      ? extractFileStructureFactory(path, reportFiles) : {};

    return {
      ...acc,
      ...children,
      [path]: {
        ...acc[path],
        ...reportFiles[path],
        structure,
      },
    };
  }, {} as QualityReport['files']);

  return files;
}

export const extractQualityReport = async (
  basePath: string,
  reportPath: string,
  analyses: ConfigParams['analyses'],
  task: Task
) => {
  // Get file structure.
  const path = resolve(basePath, reportPath);
  try {
    const { result: report } = await task(
      `Extracting report data for ${basePath} expecting report at ${reportPath}.`,
      async ({ setError }) => {
        try {
          const data = await extractQualityReportData(path);
          const parsed = typeof data === 'string' && typeof data !== 'object'
            ? JSON.parse(data)
            : data
          ;
          return qualityReportSchema.parse(parsed);
        } catch(e) {
          if (e instanceof Error || typeof e === 'string') {
            setError(e);
          } else {
            setError(JSON.stringify(e));
          }
          throw e;
        }
      }
    );

    // TODO: Need to feed filtered excluded or included files into here.
    const files = extractFileStructureFactory(basePath, report.files);

    const { result } = await task(
      'Running config functions',
      async ({ task }) => {
        const { base, setAnalysis } = mergeReportFactory({ ...report, files });
        for (const configIdx in analyses) {
          await task(
            `Running config function ${configIdx}`,
            async ({ setWarning, task }) => {
              const fn = analyses[configIdx];

              try {
                // TODO: Include a function to easily find the included/excluded files.
                fn({ setAnalysis, task });
              } catch (e) {
                if (e instanceof Error  || typeof e === 'string') {
                  setWarning(e);
                } else {
                  setWarning(JSON.stringify(e));
                }
              }
              return;
            }
          );
        }
        return base;
      }
    );

    return result;
  } catch (error) {
    console.error('Error extracting report:', error);
    throw new Error(`Failed to scan directory at "${path}".`);
  }
};
