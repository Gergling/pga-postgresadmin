import { Temporal } from "@js-temporal/polyfill";
import { DiaryEntryDb } from "../../../../shared/features/diary/types";
import { DiaryEntryUi } from "../types";

export const mapDiaryEntryUiToDb = ({
  created,
  ...rest
}: DiaryEntryUi): DiaryEntryDb => ({
  created: created.epochMilliseconds,
  ...rest
});

export const mapDiaryEntryDbToUi = ({
  created,
  ...rest
}: DiaryEntryDb): DiaryEntryUi => ({
  created: Temporal.Instant.fromEpochMilliseconds(created),
  ...rest
});
