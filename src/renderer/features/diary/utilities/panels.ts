import { mean, sum } from "@/shared/utilities";
import {
  TEMPORAL_GRANULARITIES,
  TemporalFrequencies
} from "@/shared/features/recency";
import {
  PanelDataItem,
  TEMPORAL_GRANULARITY_SUMMARY_WEIGHTS,
  TEMPORAL_GRANULARITY_WEIGHTS
} from "@/renderer/shared/dashboard";

const name = 'diary-entry-frequency';

export const getDiaryPanelCandidates = (
  entryFrequencies: TemporalFrequencies
) => TEMPORAL_GRANULARITIES.reduce((candidates, granularity): PanelDataItem[] => {
  const granularityWeight = TEMPORAL_GRANULARITY_WEIGHTS[granularity];
  const {
    summary: { populated }, frequencies, size, breakdownKey,
  } = entryFrequencies[granularity];
  const summaryWeight = TEMPORAL_GRANULARITY_SUMMARY_WEIGHTS[populated];
  const sparklineWeight = granularityWeight * summaryWeight;
  const label = `Diary entries ${populated === 'last'
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
  const valueSum = sum(values);
  const valueMean = mean(values);
  const valueMax = Math.max(...values);
  const valueWeight = valueMean / valueMax;

  const chipCandidate: PanelDataItem = {
    display: 'chip', label, weights: {
      achievement: valueWeight,
      opportunity: valueWeight,
    },
    name, value: valueSum,
  };
  const sparklineCandidate: PanelDataItem = {
    display: 'sparkline', label, weights: {
      achievement: sparklineWeight,
      opportunity: sparklineWeight,
    },
    name, value: values,
  };
  return [
    ...candidates,
    chipCandidate,
    sparklineCandidate,
  ];
}, []);
