import * as fs from 'fs';
import { NormalisedReport } from "../types";

export const generateQualityReport = (report: NormalisedReport) => {
  // TypeScript/Node.js Script Logic
  const finalReportJson = JSON.stringify(report, null, 0); // Minimize whitespace for embedding
  const htmlTemplate = fs.readFileSync('scripts/reporting/aggregator/template.html', 'utf-8');
  
  // Replace the placeholder with the actual JSON data
  const finalHtml = htmlTemplate.replace("'REPORT_DATA_PLACEHOLDER'", finalReportJson);
  
  // Write the final, runnable file
  fs.writeFileSync('dist/quality-report.html', finalHtml);
};
