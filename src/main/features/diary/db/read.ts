// Use "crud" schema (rename to db).

import { Temporal } from "@js-temporal/polyfill";
import { zonedDateTimeSchema } from "@/shared/lib/temporal";
import { DiaryEntryPersistent, diaryEntrySchema } from "@/shared/features/diary";
import { diaryRepo } from "./schema";

const recentDiaryCountFiller = 10;

export const fetchRecentDiaryEntries = async (): Promise<DiaryEntryPersistent[]> => {
  try {
    const recentSnapshot = await diaryRepo.query()
      .where('status', 'in', ['processing', 'committed', 'draft']).get();

    const snapshot = recentSnapshot.length < recentDiaryCountFiller
      && recentSnapshot.length > 0
      ? await diaryRepo.query()
        .where('id', 'not-in', recentSnapshot.map(doc => doc.id))
        .orderBy('created', 'desc')
        .limit(recentDiaryCountFiller - recentSnapshot.length)
        .get()
      : []
    ;

    console.log(snapshot)

    // Need to sort by descending created date.
    return snapshot.sort((a, b) => {
      if (a.created === b.created) return 0;
      const aZdt = zonedDateTimeSchema.parse(a.created);
      const bZdt = zonedDateTimeSchema.parse(b.created);
      return Temporal.ZonedDateTime.compare(aZdt, bZdt);
    });
  } catch (error) {
    console.error("Fetch Failed:", error);
    throw error;
  }
};
