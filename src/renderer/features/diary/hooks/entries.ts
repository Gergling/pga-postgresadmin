import { useMemo } from "react";
import { Temporal } from "@js-temporal/polyfill";
import {
  recencyFactory,
} from '@/shared/features/recency';
import {
  PanelData,
} from "@/renderer/shared/dashboard";
import { useDiaryEntryList } from "./list";
import { getDiaryPanelCandidates } from "../utilities";

export const useDiaryPanels = (): PanelData => {
  const recency = useMemo(() => {
    const now = Temporal.Now.zonedDateTimeISO()
    return recencyFactory(now);
  }, []);

  const { recentDiaryEntries: diaryEntries } = useDiaryEntryList();

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
  const candidates = getDiaryPanelCandidates(entryFrequencies);

  return candidates;
};
