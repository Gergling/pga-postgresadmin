import {
  AggregationGroup,
  AnalyticsGroup,
  AggregationStatus,
  NormalisedReport,
  ReportAggregator,
  ReportAggregatorNormaliser,
  ReportAggregatorParams,
  ReportAggregatorReturnType,
  NormalisedFile,
  VisibilitySummary,
  VisibilityStatus,
  AtomicReport
} from "../types";
import { atomise } from "./atomiser";
import { getNormalisedVisibilityFactory } from "./normalisation";
import {
  reduceGroupVisibilitySetsFactory,
  mapSummarisedReportFile,
  reduceGroupVisibilitySummaryFactory,
} from "./summary";

const reduceAggregationStatus = <T extends string, U extends string>(
  lines: AggregationStatus<T>[],
  status: AggregationStatus<U>,
  lineNumber: number,
) => {
  lines[lineNumber] = {
    ...lines[lineNumber],
    ...status,
  } as AggregationStatus<T | U>;
  return lines;
};

const reduceNormalisedReport = <T extends string, U extends string>(
  report: NormalisedReport<T>,
  [src, normalisedFile]: [string, NormalisedFile<U>],
) => {
  const file = report[src] || { lines: [], src, visibility: {} };
  const lines = normalisedFile.lines.reduce(
    reduceAggregationStatus,
    file.lines
  );
  return {
    ...report,
    [src]: {
      ...file,
      ...normalisedFile,
      visibility: {
        ...file.visibility,
        ...normalisedFile.visibility,
      },
      lines,
    },
  } as NormalisedReport<T | U>;
}

const reduceAggregation = <T extends string, U extends string>(
  report: NormalisedReport<T>,
  normalised: NormalisedReport<U>,
) => {
  return Object.entries(normalised).reduce<NormalisedReport<T | U>>(
    reduceNormalisedReport,
    report as NormalisedReport<T | U>
  );
};

const getStatusScoreFactory = <AggregationName extends string>(
  aggregationName: AggregationName,
) => (
  score: number,
) => ({
  [aggregationName]: score,
}) as AggregationStatus<AggregationName>;

const addFactory = <AggregationNames extends string>(
  {
    groups,
    report,
  }: ReportAggregatorParams<AggregationNames>,
  initialiseAggregator: ReportAggregator
): ReportAggregatorReturnType<AggregationNames>['add'] => <
  AggregationName extends string
>(
  group: AnalyticsGroup,
  aggregationName: AggregationName,
  normaliser: ReportAggregatorNormaliser<AggregationName>,
): ReportAggregatorReturnType<AggregationNames | AggregationName> => {
  const getStatusScore = getStatusScoreFactory(aggregationName);
  const getNormalisedVisibility = getNormalisedVisibilityFactory(aggregationName);
  const updatedGroups = {
    ...groups,
    [aggregationName]: group,
  } as AggregationGroup<AggregationNames | AggregationName>;
  const newReport = normaliser<AggregationName>({
    aggregationName,
    getNormalisedVisibility,
    getStatusScore,
    group
  });
  const updatedReport = reduceAggregation(report, newReport);
  const newAggregator = initialiseAggregator<
    AggregationNames | AggregationName
  >({
    groups: updatedGroups,
    report: updatedReport,
  });
  return newAggregator;
};

export const initialiseAggregator: ReportAggregator = <
  AggregationNames extends string = string
>(
  {
    groups,
    report
  } = {
    groups: {} as AggregationGroup<AggregationNames>,
    report: {} as NormalisedReport<AggregationNames>,
  },
): ReportAggregatorReturnType<AggregationNames> => {
  const add = addFactory<AggregationNames>({
    groups,
    report
  }, initialiseAggregator);
  const summarise = () => {
    const aggregationNames = Object.keys(groups);
    const atomised = atomise({ groups, report });

    // First create the groups
    atomised.reduce<{
      atomisedByFile: Record<string, AtomicReport[]>;
      atomisedByGroupVisibility: Record<string, AtomicReport[]>;
      atomisedByVisibility: Record<string, AtomicReport[]>;
    }>(
      (acc, atom) => {
        return {
          atomisedByFile: {
            ...acc.atomisedByFile,
            [atom.src]: [
              ...acc.atomisedByFile[atom.src] || [],
              atom,
            ],
          },
          atomisedByGroupVisibility: {
            ...acc.atomisedByGroupVisibility,
            [atom.visibility + '-' + atom.group]: [
              ...acc.atomisedByGroupVisibility[atom.visibility + '-' + atom.group] || [],
              atom,
            ],
          },
          atomisedByVisibility: {
            ...acc.atomisedByVisibility,
            [atom.visibility]: [
              ...acc.atomisedByVisibility[atom.visibility] || [],
              atom,
            ],
          },
        };
      }, {
        atomisedByFile: {} as Record<string, AtomicReport[]>,
        atomisedByGroupVisibility: {} as Record<string, AtomicReport[]>,
        atomisedByVisibility: {} as Record<string, AtomicReport[]>,
      }
    );
    const summarised = Object.values(report).map(mapSummarisedReportFile);
    const sets = summarised.reduce(
      reduceGroupVisibilitySetsFactory(aggregationNames),
      {} as Record<VisibilityStatus, Record<string, number[]>>
    );
    const visibility = Object.entries(sets).reduce<VisibilitySummary>(
      reduceGroupVisibilitySummaryFactory(aggregationNames),
      {} as VisibilitySummary
    );
    return {
      summarised,
      visibility,
    };
  }
  return {
    add,
    groups,
    report,
    summarise,
  };
};
