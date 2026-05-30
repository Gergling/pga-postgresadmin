import { Temporal } from "@js-temporal/polyfill";
import { temporalCodec } from "@/shared/lib/temporal";
import {
  DiaryEntryTransfer,
  diaryEntryTransferSchema
} from "@/shared/features/diary";
import { diaryRepo } from "../schema";

const recentDiaryCountFiller = 10;

export const fetchRecentDiaryEntries = async (): Promise<DiaryEntryTransfer[]> => {
  try {
    const recentSnapshot = await diaryRepo.query()
      .where('data.status', 'in', ['processing', 'committed', 'draft']).get();

    const snapshot = recentSnapshot.length < recentDiaryCountFiller
      ? await diaryRepo.query()
        .where('id', 'not-in', recentSnapshot.map(doc => doc.id))
        .orderBy('created', 'desc')
        .limit(recentDiaryCountFiller - recentSnapshot.length)
        .get()
      : []
    ;

    const entries = snapshot.map(
      (item) => diaryEntryTransferSchema.parse(item)
    );

    // Need to sort by descending created date.
    return entries.sort((a, b) => {
      if (a.created === b.created) return 0;
      const aZdt = temporalCodec.decode(a.created).zonedDateTime;
      const bZdt = temporalCodec.decode(b.created).zonedDateTime;
      return Temporal.ZonedDateTime.compare(aZdt, bZdt);
    });
  } catch (error) {
    console.error("Fetch Failed:", error);
    throw error;
  }
};

export const fetchCommittedDiaryEntries = async (): Promise<DiaryEntryTransfer[]> => {
  const snapshot = await diaryRepo.query()
    .where('status', '==', 'committed')
    .orderBy('created', 'desc')
    // TODO: Probably need to choose the limit appropriately.
    .limit(10)
    .get();

  const entries = snapshot.map((item) => diaryEntryTransferSchema.parse(item));

  return entries;
};
export const fetchDiaryEntry = async (id: string): Promise<DiaryEntryTransfer> => {
  const snapshot = await diaryRepo.query().where('id', '==', id).getOne();

  if (!snapshot) throw new Error(`Diary entry not found for id: ${id}`);

  return diaryEntryTransferSchema.parse(snapshot);
};
export const fetchProcessingCount = async (): Promise<number> => diaryRepo
  .query().count();

