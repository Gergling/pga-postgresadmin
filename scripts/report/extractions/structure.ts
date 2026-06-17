import { readdirSync } from "fs";
import { QualityReport, QualityReportFile } from "../schemas";
import { normalise } from "../utilities";

export const extractFileStructure = (
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
      ? extractFileStructure(path, reportFiles) : {};

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
