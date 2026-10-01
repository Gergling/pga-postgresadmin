import {
  Series,
} from "@/shared/utilities";
import {
  TEMPORAL_GRANULARITIES,
  TemporalFrequencies
} from "@/shared/features/recency";
import {
  TEMPORAL_GRANULARITY_SUMMARY_WEIGHTS,
  TEMPORAL_GRANULARITY_WEIGHTS
} from "../constants";
import { PanelDataItem } from "../types";

const getChipCandidate = (
  label: string,
  name: string,
  series: Series
): PanelDataItem => {
  const valueWeight = series.mean / series.max;
  return {
    display: 'chip', label, weights: {
      achievement: valueWeight,
      opportunity: valueWeight,
    },
    name, value: series.sum,
  };
};
const getDeltaCandidate = (
  label: string,
  name: string,
  series: Series
): PanelDataItem => {
  const deltas = series.clone('deltas');
  const valueWeight = deltas.last / deltas.max;
  return {
    display: 'delta', label, weights: {
      achievement: valueWeight,
      opportunity: valueWeight,
    },
    name, value: deltas.last,
  };
};
const getSparklineCandidate = (
  label: string,
  name: string,
  weights: PanelDataItem['weights'],
  series: Series
): PanelDataItem => ({
  display: 'sparkline', label, weights,
  name, value: series.data,
});

type GetPanelCandidatesFactoryConfig = {
  name: string;
  title: string;
}
export const getPanelCandidatesFactory = ({
  name, title
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

  const chipCandidate = getChipCandidate(label, name, series);
  const deltaCandidate = getDeltaCandidate(label, name, series);
  const sparklineCandidate = getSparklineCandidate(label, name, {
    achievement: sparklineWeight,
    opportunity: sparklineWeight,
  }, series);
  return [
    ...candidates,
    chipCandidate,
    deltaCandidate,
    sparklineCandidate,
  ];
}, []);
