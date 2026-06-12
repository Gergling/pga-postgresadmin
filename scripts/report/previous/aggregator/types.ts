export type VisibilityStatus = 'default' | 'mute' | 'highlight';

export type VisibilityStatusLabel = {
  name: VisibilityStatus;
  label: string;
};

export type OverviewVisibilityStatus = VisibilityStatus | 'overview' | 'reports';
export type OverviewVisibilityStatusLabel = {
  name: OverviewVisibilityStatus;
  label: string;
};

export type AnalyticsGroup = 'coverage' | 'lint' | 'live';

export type AnalyticsGroupLabel = {
  name: AnalyticsGroup;
  label: string;
};

export type VisibilityGroup = Record<VisibilityStatus, Record<AnalyticsGroup, number>>;

// TODO: AggregationNames are pointless. Remove them. They're not providing
// type safety and they're making things complicated. Adding explicit types
// at runtime is an appalling use of generics and needs to be nuked.
export type AggregationGroup<
  AggregationNames extends string = string
> = Record<AggregationNames, AnalyticsGroup>;

export type AggregationStatus<
  AggregationName extends string = string
> = Record<AggregationName, number>;

export type NormalisedFile<AggregationName extends string = string> = {
  lines: AggregationStatus<AggregationName>[];
  src: string;
  visibility: Record<AggregationName, VisibilityStatus>;
};

export type SummarisedFile<AggregationName extends string = string> = NormalisedFile<AggregationName> & {
  summary: AggregationStatus<AggregationName>;
};

export type NormalisedReport<AggregationName extends string = string> = {
  [fileName: string]: NormalisedFile<AggregationName>;
};

export type AtomicReport = {
  aggregation: string;
  group: AnalyticsGroup;
  line: number;
  src: string;
  value: number;
  visibility: VisibilityStatus;
};

export type VisibilitySummary = Record<VisibilityStatus, AggregationStatus>;

export type GetNormalisedVisibility<AggregationName extends string> = (
  visibility: VisibilityStatus
) => Record<AggregationName, VisibilityStatus>;

export type GetStatusScore<AggregationName extends string> = (
  score: number
) => AggregationStatus<AggregationName>;

export type ReportAggregatorNormaliser<
  T extends string
> = <
  AggregationName extends T
>(props: {
  aggregationName: AggregationName;
  getNormalisedVisibility: GetNormalisedVisibility<AggregationName>;
  getStatusScore: GetStatusScore<AggregationName>;
  group: AnalyticsGroup;
}) => NormalisedReport<T>;

export type ReportAggregatorParams<AggregationNames extends string = string> = {
  groups: AggregationGroup<AggregationNames>;
  report: NormalisedReport<AggregationNames>;
};

export type ReportAggregatorReturnType<
  AggregationNames extends string = string
> = ReportAggregatorParams<AggregationNames> & {
  add: <AggregationName extends string = string>(
    group: AnalyticsGroup,
    aggregationName: AggregationName,
    normaliser: ReportAggregatorNormaliser<AggregationName>
  ) => ReportAggregatorReturnType<AggregationNames | AggregationName>;
  summarise: () => {
    summarised: SummarisedFile[];
    visibility: VisibilitySummary;
  };
};

export type ReportAggregator = <
  AggregationNames extends string = string
>(
  props?: ReportAggregatorParams<AggregationNames>
) => ReportAggregatorReturnType<AggregationNames>;
