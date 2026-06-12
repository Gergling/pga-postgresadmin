import { temporalCodec } from "@/shared/lib/temporal";
import { QualityReport, qualityReportSchema } from "./schema";
import { Temporal } from "@js-temporal/polyfill";

// export const transformReport = (data: QualityReport) => {
//   const report = qualityReportSchema.parse(data);
// };

export const transformQualityReportMetadata = (data: QualityReport) => {
  const { meta: { last } } = data;
  const started = temporalCodec.decode(last.started).zonedDateTime;
  const ended = temporalCodec.decode(last.ended).zonedDateTime;
  const isRunning = Temporal.ZonedDateTime.compare(started, ended) === 1;
  return { started, ended, isRunning };
};

// Note that dimensional aggregations and filters will be required.
// Metadata:
  // Whether the report is still running (generated empty with a start after the end). So basically a status of idle or running at any given time.
// Aggregations:
  // file-level coverage per total lines in file.
// Filters:
  // File-level specified function(s) cannot be in dead list.
  // File-level architecture updates that have changed since the last report.
