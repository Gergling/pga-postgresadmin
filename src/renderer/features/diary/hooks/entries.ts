import { useMemo } from "react";
import { Temporal } from "@js-temporal/polyfill";
import {
  recencyFactory,
  TEMPORAL_GRANULARITIES
} from '@/shared/features/recency';
import {
  PanelData,
  PanelDataItem,
  TEMPORAL_GRANULARITY_SUMMARY_WEIGHTS,
  TEMPORAL_GRANULARITY_WEIGHTS
} from "@/renderer/shared/dashboard";
import { TEMPORAL_UNIT_PROPS_SINGULARISED } from "@shared/lib/temporal";
import { useDiaryEntryList } from "./list";
import { getRelativeTimeNow } from "@/renderer/shared/common/utilities/relative-time";

// const recencyConfig: Partial<Record<keyof Temporal.Duration, {
//   label: string;
//   value: number;
// }>>[] = [
//   { days:  }
// ];

// const x = {
//   recent: { days: 2 },

// };

export const useDiaryPanels = (): PanelData => {
  const recency = useMemo(() => {
    const now = Temporal.Now.zonedDateTimeISO()
    return recencyFactory(now);
  }, []);

  // const {
  //   diaryEntries,
  //   ipcStatus: { fetch: status },
  // } = useDiaryIpc(true);
  const { recentDiaryEntries: diaryEntries } = useDiaryEntryList();
  console.log('entries', diaryEntries)

  const dates = useMemo(() => diaryEntries.map(
    ({ created: { zonedDateTime } }) => zonedDateTime
  ) ?? [], [diaryEntries]);
  // const dates: Temporal.ZonedDateTime[] = [];
  // Four possible sparklines available from this.
  // Pick the highest granularity with the fewest 0 values.
  // No 0 values should maximise the weight.
  // Weight should decrease with granularity.
  const entryFrequencies = useMemo(
    () => recency.getTemporalFrequencies(dates), [dates]
  );
  const candidates = TEMPORAL_GRANULARITIES.map((granularity): PanelDataItem => {
    const granularityWeight = TEMPORAL_GRANULARITY_WEIGHTS[granularity];
    const {
      summary: { populated }, frequencies, size, breakdownKey
    } = entryFrequencies[granularity];
    const summaryWeight = TEMPORAL_GRANULARITY_SUMMARY_WEIGHTS[populated];
    const weight = granularityWeight * summaryWeight;
    const label = `Diary entries ${populated === 'last'
      ? `in the last ${size} ${breakdownKey.toString()}`
      : `for this and last ${TEMPORAL_UNIT_PROPS_SINGULARISED[granularity]}`}`
    ;
    // If populated === 'last', then we can filter out the frequency categories
    // such as 'prior'.
    console.log(frequencies)
    const value = Object.values(frequencies).sort(
      (a, b) => a.key.localeCompare(b.key)
    ).filter(
      // TODO: Slightly wasteful. Doesn't need to run this loop at all if
      // populated !== 'last.
      ({ category }) => category !== 'prior' || populated !== 'last'
    ).map(({ value }) => value);
    return {
      display: 'sparkline',
      name: 'diary-entry-frequency',
      label, value, weight,
    };
  }, []);

  const chips = useMemo(() => diaryEntries?.reduce((acc, entry) => {
    const since = getRelativeTimeNow(entry.created.zonedDateTime);
    // if (since.days < 2) {}
    // TODO: Get the recency counts based on various thresholds.
    // console.log(since.toString())
    return {
      ...entry,
    };
  }, {}), [diaryEntries]);

  return candidates;
};
