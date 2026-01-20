import { Temporal } from "@js-temporal/polyfill";
import { DiaryEntryUi, DiaryEntryUiOptional } from "../types";

export const cleanEntry = ({ created, ...entry}: DiaryEntryUiOptional): DiaryEntryUi => {
  if (typeof created !== 'number') return { ...entry, created };
  return {
    ...entry,
    created: Temporal.Instant.fromEpochMilliseconds(created),
  };
};

export const cleanEntries = (entries: DiaryEntryUiOptional[]) => entries
  .map(cleanEntry)
  .sort((a, b) => {
    const aNoCreateTime = !('created' in a);
    const bNoCreateTime = !('created' in b);
    if (aNoCreateTime && bNoCreateTime) return 0;
    if (aNoCreateTime) return 1;
    if (bNoCreateTime) return -1;
    return b.created.epochMilliseconds - a.created.epochMilliseconds;
  });
