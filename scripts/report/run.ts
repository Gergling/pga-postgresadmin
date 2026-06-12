import task from "tasuku";
import { extractQualityReport } from "./extract";
import { resolve } from "path";
import { writeQualityReport } from "./load";

const run = async () => {
  const basePath = './';
  const reportPath = 'reports/quality-report.json';
  const path = resolve(basePath, reportPath);
  const { error, result: extractionResult, state, warning } = await task(
    'Extracting quality report...',
    async ({ task }) => extractQualityReport(
      './', 'reports/quality-report.json', task
    )
  );
  const {
    error: loadError, result: loadResult, state: loadState, warning: loadWarning
  } = await task(
    'Writing quality report...',
    async ({ task }) => writeQualityReport(
      path, extractionResult, task
    )
  );
  // console.log(extraction.files);

};

run();

// TODO: By default, creates report at the base. Otherwise uses report location
// given.
// Base and report path should be (optional) arguments JIC the runner is a
// custom job.
