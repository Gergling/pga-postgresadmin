import {
  DiaryEntrySerialisation,
  diaryEntrySerialisationSchema
} from "@/shared/features/diary";
import z from "zod";
import { setupCollection } from "@/main/libs/database";
import { createProcrastinatedRepo } from "@main/libs/firebase";

export const persistentDiaryCodec = z.codec(
  diaryEntrySerialisationSchema,
  diaryEntrySerialisationSchema,
  {
    decode: (value) => diaryEntrySerialisationSchema.parse(value),
    encode: (value) => diaryEntrySerialisationSchema.parse({ ...value, creationKey: undefined }),
  }
);

export const diaryRepo = createProcrastinatedRepo<DiaryEntrySerialisation>(
  'diary',
  diaryEntrySerialisationSchema
);
export const { local: diaryDb } = setupCollection<DiaryEntrySerialisation>(
  'diary',
  diaryEntrySerialisationSchema
);
