import { Temporal } from "@js-temporal/polyfill";
import { DiaryEntryBase } from "../../../shared/features/diary/types";

export interface DiaryEntryUi extends DiaryEntryBase {
  created: Temporal.Instant;
}
