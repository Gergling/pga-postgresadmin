import * as fs from 'fs';
import {
  normaliseCoverageReportFactory,
  normaliseTypeScriptErrors,
  VisibilityStatusCallback
} from "./normalisers";
import { VisibilityStatus } from './aggregator/types';
import { initialiseAggregator } from './aggregator/utilities/factory';
import { getReportHTML } from './aggregator/utilities/html';

// Extraction
const fetchCoverageReport = () => {
  try {
    const contents = fs.readFileSync('./coverage/coverage-final.json', 'utf8');
    return JSON.parse(contents);
  } catch(e) {
    console.error('Error fetching coverage report:', e);
  }
};

// Transform
const unitTestVisibility: VisibilityStatusCallback = (
  filePath: string
): VisibilityStatus => {
  if (filePath.includes('utilities/') || filePath.endsWith('utilities.ts')) return 'highlight';
  if (filePath.startsWith('src/')) return 'default';

  return 'mute';
};

const main = () => {
  const coverageReport = fetchCoverageReport();
  // const normalisedTsReport = normaliseTypeScriptErrors();
  // We're going to assume this is unit test coverage for now.
  // const normalisedCoverageReport = normaliseCoverageReport(
  //   coverageReport, 
  //   unitTestVisibility
  // );
  // console.log(Object.keys(tsReport))
  const aggregator = initialiseAggregator()
    // Parses in things like the check type.
    // Should throw for identical names.
    .add('lint', 'type-check', normaliseTypeScriptErrors())
    // Will want integration test coverage from playwright later.
    // Unit test coverage will probably include component tests.
    .add('coverage', 'unit-test-coverage', normaliseCoverageReportFactory(
      coverageReport,
      unitTestVisibility
    ))
    // Will want knip for live report.
    // .add('live', 'export-usage-check', normaliseKnipReport)
  ;
  // console.log('aggregator', aggregator)
  const htmlContent = getReportHTML(aggregator);
  const htmlTemplate = fs.readFileSync('scripts/reporting/aggregator/template2.html', 'utf-8');
  const html = htmlTemplate.replace("%%BODY%%", htmlContent);

  fs.writeFileSync('./dist/code-quality-report.html', html);

  // const aggregator = createAggregation([
  //   normalisedTsReport,
  //   normalisedCoverageReport,
  // ]);
  // const report = normaliseTypeScriptErrors('./tsconfig.json');
  // const report2 = normaliseCoverageReport(coverageReport);
  // aggregator.summarised.forEach(({ src, summary }) => console.log(`${src}: ${JSON.stringify(summary)}`));
  // console.log(aggregator.visibility);
};

main();
