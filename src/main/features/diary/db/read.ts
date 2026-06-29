import { Temporal } from "@js-temporal/polyfill";
import { dateSerialisationCodec } from "@/shared/schema";
import {
  DiaryEntrySerialisation,
  diaryEntrySerialisationSchema
} from "@/shared/features/diary";
import { diaryDb, diaryRepo } from "../schema";

const recentDiaryCountFiller = 10;

export const fetchRecentDiaryEntries = async (): Promise<DiaryEntrySerialisation[]> => {
  try {
    const recentSnapshot = await diaryDb.db.findAsync({
      'data.status': { $in: ['processing', 'committed', 'draft'] }
    });

    const fillerSnapshot = recentSnapshot.length < recentDiaryCountFiller
      ? await diaryDb.db.findAsync({
        'id': {
          $nin: recentSnapshot.map(doc => doc.id)
        }
      }).sort({
        created: -1
      }).limit(recentDiaryCountFiller - recentSnapshot.length) : [];

    const entries = [...recentSnapshot, ...fillerSnapshot].map(
      (item) => diaryEntrySerialisationSchema.parse(item)
    );

    // Sort by descending created date.
    return entries.sort((a, b) => {
      if (a.created === b.created) return 0;
      const aZdt = dateSerialisationCodec.decode(a.created);
      const bZdt = dateSerialisationCodec.decode(b.created);
      return Temporal.ZonedDateTime.compare(bZdt, aZdt);
    });
  } catch (error) {
    console.error("Fetch Failed:", error);
    throw error;
  }
};

export const fetchCommittedDiaryEntries = async (): Promise<DiaryEntrySerialisation[]> => {
  const snapshot = await diaryRepo.query()
    .where('status', '==', 'committed')
    .orderBy('created', 'desc')
    // TODO: Probably need to choose the limit appropriately.
    .limit(10)
    .get();

  const entries = snapshot.map((item) => diaryEntrySerialisationSchema.parse(item));

  return entries;
};
export const fetchDiaryEntry = async (id: string): Promise<DiaryEntrySerialisation> => {
  const snapshot = await diaryRepo.query().where('id', '==', id).getOne();

  if (!snapshot) throw new Error(`Diary entry not found for id: ${id}`);

  return diaryEntrySerialisationSchema.parse(snapshot);
};
export const fetchProcessingCount = async (): Promise<number> => diaryRepo
  .query().count();

