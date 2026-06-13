import { typeCheck } from "./scripts/report/config/type-check";
import { createQualityReportConfig } from "./scripts/report/utilities/config";

export default createQualityReportConfig({
  analyses: [
    typeCheck,
  ],
  paths: {
    base: './',
    report: 'reports/quality-analysis.json',
  },
});
