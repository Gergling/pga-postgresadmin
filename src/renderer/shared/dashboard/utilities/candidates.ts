import {
  Series,
} from "@/shared/utilities";
import {
  TEMPORAL_GRANULARITIES,
  TemporalFrequencies,
  TemporalGranularity
} from "@/shared/features/recency";
import {
  TEMPORAL_GRANULARITY_SUMMARY_WEIGHTS,
  TEMPORAL_GRANULARITY_WEIGHTS
} from "../constants";
import { PanelDataFeature, PanelDataItem } from "../types";

type Params = Pick<PanelDataItem, 'feature' | 'label' | 'name'> & {
  granularity: TemporalGranularity;
};

const getBaseCandidate = <T extends Params & Pick<PanelDataItem, 'display'>>(
  { granularity, ...props }: T
): Omit<T, 'granularity'> & Pick<PanelDataItem, 'display' | 'id'> => ({
  ...props, id: `${props.display}-${props.feature}-${props.name}-${granularity}`
});

const getChipCandidate = (
  params: Params,
  series: Series
): PanelDataItem => {
  const valueWeight = series.mean / series.max;
  return {
    ...getBaseCandidate({ ...params, display: 'chip' }), weights: {
      achievement: valueWeight,
      opportunity: valueWeight,
    },
    value: series.sum,
  };
};
const getDeltaCandidate = (
  params: Params,
  series: Series
): PanelDataItem => {
  const deltas = series.clone('deltas');
  const valueWeight = deltas.last / deltas.max;
  return {
    ...getBaseCandidate({ ...params, display: 'delta' }), weights: {
      achievement: valueWeight,
      opportunity: valueWeight,
    },
    value: deltas.last,
  };
};
const getSparklineCandidate = (
  { weights, ...params }: Params & Pick<PanelDataItem, 'weights'>,
  series: Series
): PanelDataItem => ({
  ...getBaseCandidate({ ...params, display: 'sparkline' }),
  weights, value: series.data,
});

type GetPanelCandidatesFactoryConfig = {
  feature: PanelDataFeature;
  name: string;
  title: string;
}
export const getPanelCandidatesFactory = ({
  feature, name, title
}: GetPanelCandidatesFactoryConfig) => (
  entryFrequencies: TemporalFrequencies
) => TEMPORAL_GRANULARITIES.reduce((candidates, granularity): PanelDataItem[] => {
  const granularityWeight = TEMPORAL_GRANULARITY_WEIGHTS[granularity];
  const {
    summary: { populated }, frequencies, size, breakdownKey,
  } = entryFrequencies[granularity];
  const summaryWeight = TEMPORAL_GRANULARITY_SUMMARY_WEIGHTS[populated];
  const sparklineWeight = granularityWeight * summaryWeight;
  const label = `${title} ${populated === 'last'
    ? `last ${size} ${breakdownKey.toString()}`
    : `recent ${granularity}`}`
    ;
  // If populated === 'last', then we can filter out the frequency categories
  // such as 'prior'.
  const values = Object.values(frequencies).filter(({ key }) => key).sort(
    (a, b) => a.key.localeCompare(b.key)
  ).filter(
    // TODO: Slightly wasteful. Doesn't need to run this loop at all if
    // populated !== 'last.
    ({ category }) => category !== 'prior' || populated !== 'last'
  ).map(({ value }) => value);
  const series = Series.from(values);

  const candidateParams: Params = { feature, granularity, label, name };

  const chipCandidate = getChipCandidate(candidateParams, series);
  const deltaCandidate = getDeltaCandidate(candidateParams, series);
  const sparklineCandidate = getSparklineCandidate({
    ...candidateParams,
    weights: { achievement: sparklineWeight, opportunity: sparklineWeight },
  }, series);
  return [
    ...candidates,
    chipCandidate,
    deltaCandidate,
    sparklineCandidate,
  ];
}, []);
