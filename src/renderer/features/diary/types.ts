import { Temporal } from "@js-temporal/polyfill";
import { DiaryEntry } from "../../../shared/features/diary/types";

export type DiaryEntryUi = Omit<DiaryEntry, 'created'> & {
  created: Temporal.Instant;
};

export type DiaryEntryUiNew = Pick<DiaryEntryUi, 'text'>;
export type DiaryEntryUiOptional = DiaryEntryUi | DiaryEntry;
