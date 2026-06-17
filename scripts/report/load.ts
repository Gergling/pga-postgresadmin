import { mkdir, writeFile } from "fs";
import { promisify } from "util";
import { dirname } from "path";
import { fileExists } from "@/main/shared/file/exists";
import { getNow, QualityReport, qualityReportSchema } from "./schemas";
import { mergeReport } from "./utilities";
import { Task } from "tasuku";

const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);

export const writeQualityReport = async (
  path: string, report: QualityReport, task: Task
) => {
  const extended = qualityReportSchema.parse(
    mergeReport(report, {
      type: 'meta', value: {
        last: {
          ended: getNow(),
        },
      },
    })
  );

  const dir = dirname(path);

  const { result: exists } = await task(
    `Checking for quality report directory for ${path}.`,
    async () => fileExists(dir)
  );
  if (!exists) {
    await task(
      'No directory found. Creating directory.',
      async () => mkdirAsync(dir, { recursive: true })
    );
  }

  await task(
    `Writing quality report to ${path}.`,
    async () => writeFileAsync(path, JSON.stringify(extended, null, 2))
  );
}
