import task from "tasuku";
import { extractQualityReport } from "./extract";
import { resolve } from "path";
import { writeQualityReport } from "./load";
import { configParamsSchema } from "./schemas";

const configPath = '../../quality-report.config';

const run = async () => {
  // Extract
  // TODO: Handle when config doesn't exist and create it accordingly.
  // TODO: Config may have... oddities. Might be worth checking them. Maybe a
  // transform function will do it.
  const { result: content } = await task(
    'Loading config', async () => (await import(configPath)).default
  );
  const {
    analyses, paths: { base, report }
  } = configParamsSchema.parse(content);
  const path = resolve(base, report);
  const { error, result: extractionResult, state, warning } = await task(
    'Extracting quality report...',
    async ({ task }) => extractQualityReport(
      base, report, analyses, task
    )
  );

  // Transform
  // const transformation = [].reduce(
  //   (report, transformer) => transformer(report), extractionResult
  // );

  // Load
  const {
    error: loadError, result: loadResult, state: loadState, warning: loadWarning
  } = await task(
    'Writing quality report...',
    async ({ task }) => writeQualityReport(
      path, extractionResult, task
    )
  );
};

run();

// TODO: By default, creates config at the base. Otherwise uses report location
// given.
// Base and report path should be (optional) arguments JIC the runner is a
// custom job.
