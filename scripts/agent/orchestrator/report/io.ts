// Update specific sections of the report.
// This is a good place to tie together the report update data and the relevant
// fetch functions that get the data.
// This way, all data report data can come through the report.
// We can get the initial state, and run a relevant update if necessary.
// For now, we'll just use individual functions until we figure out what we're
// doing.

import fs from "node:fs";
import path from "node:path";
import { OrchestratorAgentDomain } from "../types";
import { hydrateReport } from "./hydrate";
import { OrchestratorReport } from "./types";
import { getOrchestratorRunState } from "./utilities";

const REPORT_FILE_PATH = path.resolve('./orchestrator-report.json');

const fetchReportFile = (): OrchestratorReport | undefined => {
  const reportExists = fs.existsSync(REPORT_FILE_PATH);

  if (!reportExists) return;

  const report = fs.readFileSync(REPORT_FILE_PATH, {
    encoding: 'utf-8'
  });

  const parsed = JSON.parse(report);

  // TODO: Could do with a deeper check to see whether this matches the type.
  // The risk is that the existing properties are overwritten with anything,
  // perhaps from an old report version.

  const hydrated = hydrateReport(parsed);

  return hydrated;
};

const writeReportFile = (content: OrchestratorReport) => fs.writeFileSync(
  REPORT_FILE_PATH,
  JSON.stringify(content, null, 2)
);

/**
 * 
 * @param content (Optional) OrchestratorReport type for overriding the
 * existing report. Will write the report.
 * @returns 
 */
const syncReport = (
  content?: OrchestratorReport
): OrchestratorReport => {
  // Check the report file.
  const existingReport = fetchReportFile();

  // Hydrate the report with any existing report data and any updated content.
  const latestReport = hydrateReport({
    ...existingReport, ...content,
  });

  // If contents specified OR the file didn't exist, write file.
  if (content || !existingReport) {
    writeReportFile(latestReport);
  }

  // Return contents.
  return latestReport;
};

/**
 * 
 * @returns true if the report has started a run, and false if not.
 */
const reportStartRun = (
  domain: OrchestratorAgentDomain
) => {
  const report = syncReport();
  const {
    hasRunBefore,
    isFirstRun,
    isRunning,
  } = getOrchestratorRunState(report);

  // Clearly signal that the report should not start.
  if (!isRunning) return false;

  const started = Date.now();

  writeReportFile({
    ...report,
    current: {
      ...report.current,
      last: {
        ...report.current.last,
        started,
        domain,
      },
    },
  });

  return true;
};
