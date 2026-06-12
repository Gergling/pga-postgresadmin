import {
  AggregationGroup,
  AggregationStatus,
  AnalyticsGroup,
  NormalisedFile,
  SummarisedFile,
  VisibilityStatus,
  VisibilitySummary
} from "../types";
import { getMean } from "./maths";

type RecordSet = Record<string, number[]>;

export const mapSummarisedReportFile = (
  { lines, src, visibility }: NormalisedFile,
): SummarisedFile => {
  const lineSets = lines.reduce<RecordSet>(
    (lineSets, lineStatus) => {
      return Object.entries(lineStatus).reduce<RecordSet>(
        (lineSets, [aggregationName, lineScore]) => {
          return {
            ...lineSets,
            [aggregationName]: [
              ...(lineSets[aggregationName] || []),
              lineScore,
            ],
          };
        },
        lineSets
      );
    },
    {}
  );
  const summary = Object.entries(lineSets).reduce<AggregationStatus>(
    (summary, [aggregationName, lineScores]) => {
      const mean = getMean(lineScores);
      return {
        ...summary,
        [aggregationName]: mean,
      };
    },
    {}
  );
  return {
    lines,
    src,
    summary,
    visibility,
  };
};

export const reduceGroupVisibilitySetsFactory = (
  aggregationNames: string[],
) => (
  sets: Record<VisibilityStatus, Record<string, number[]>>,
  { summary, visibility }: SummarisedFile,
): Record<VisibilityStatus, Record<string, number[]>> => {
  return aggregationNames.reduce((sets, aggregationName) => {
    const visibilityStatus = visibility[aggregationName];
    if (!visibilityStatus) {
      return sets;
    }
    const value = summary[aggregationName] || 0;
    return {
      ...sets,
      [visibilityStatus]: {
        ...sets[visibilityStatus],
        [aggregationName]: [
          ...((sets[visibilityStatus] || {})[aggregationName] || []),
          value,
        ],
      },
    };
  }, sets);
};

export const reduceGroupVisibilitySummaryFactory = (
  aggregationNames: string[],
) => (
  visibilitySummary: VisibilitySummary,
  [ visibilityStatusStr, numberSet ]: [
    string,
    Record<string, number[]>,
  ],
): VisibilitySummary => {
  const visibilityStatus = visibilityStatusStr as VisibilityStatus;
  return aggregationNames.reduce(
    (visibilitySummary, aggregationName) => {
      const aggregationNumberSet = numberSet[aggregationName];
      if (aggregationNumberSet === undefined) {
        return visibilitySummary;
      }
      const mean = getMean(numberSet[aggregationName]);
      return {
        ...visibilitySummary,
        [visibilityStatus]: {
          ...visibilitySummary[visibilityStatus],
          [aggregationName]: mean,
        },
      };
    },
    visibilitySummary
  );
};

export const getGroupedMeanAggregationStatus = (
  aggregationStatus: AggregationStatus,
  aggregationGroup: AggregationGroup,
): Record<AnalyticsGroup, number> => {
  const groupStatuses = Object.entries(aggregationGroup).reduce(
    (
      groupStatuses,
      [aggregationName, group]
    ): Record<AnalyticsGroup, number[]> => {
      if (!aggregationStatus[aggregationName]) return groupStatuses;
      return {
        ...groupStatuses,
        [group]: [
          ...(groupStatuses[group] || []),
          aggregationStatus[aggregationName] || 0,
        ]
      };
    },
    {} as Record<AnalyticsGroup, number[]>
  );
  return Object.entries(groupStatuses).reduce((
    acc,
    [group, statuses]
  ) => ({
    ...acc,
    [group]: getMean(statuses),
  }), {} as Record<AnalyticsGroup, number>);
};

export const getGroupedAggregation = (
  groups: AggregationGroup
) => Object.entries(groups).reduce((
  acc,
  [aggregationName, group]
) => ({
  ...acc,
  [group]: [
    ...(acc[group] || []),
    aggregationName
  ],
}), {} as Record<string, string[]>);
