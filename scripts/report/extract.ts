import { readdirSync } from "fs";
import { resolve } from "path";
import { readFileContents } from "@/main/shared/file/contents";
import { fileExists } from "@/main/shared/file/exists";
import { QualityReport, QualityReportFile, qualityReportSchema } from "./schema";
import { config } from "./config";
import { normalise } from "./utilities/normalise";
import { mergeReport } from "./utilities";
import { Task } from "tasuku";

const extractQualityReportData = async (path: string) => {
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
  task: Task
) => {
  // Get file structure.
  const path = resolve(basePath, reportPath);
  try {
    const { result: reportData } = await task(
      `Extracting report data for ${basePath} expecting report at ${reportPath}.`,
      () => extractQualityReportData(path)
    );

    const report = qualityReportSchema.parse(reportData);
    // TODO: Need to feed filtered excluded or included files into here.
    const files = extractFileStructureFactory(basePath, report.files);

    const { result } = await task(
      'Running config functions',
      async ({ task }) => {
        let acc = { ...report, files };
        for (const configIdx in config) {
          const { result } = await task(
            `Running config function ${configIdx}`,
            async ({ setWarning, task }) => {
              const fn = config[configIdx];

              try {
                // TODO: Include a function to easily find the included/excluded files.
                const report = fn({ task });
                try {
                  return mergeReport(acc, report);
                } catch (e) {
                  setWarning('Config Result Parse Error');
                  // if (e instanceof Error  || typeof e === 'string') {
                  //   setWarning(e);
                  // } else {
                  //   setWarning(JSON.stringify(e));
                  // }
                  // console.error(report);
                  // return acc;
                  throw e;
                }
              } catch (e) {
                if (e instanceof Error  || typeof e === 'string') {
                  setWarning(e);
                } else {
                  setWarning(JSON.stringify(e));
                }
                return acc;
              }
            }
          );
          acc = { ...acc, ...result };
        }
        return acc;
      }
    );

    return result;
  } catch (error) {
    console.error('Error extracting report:', error);
    throw new Error(`Failed to scan directory at "${path}".`);
  }
};
