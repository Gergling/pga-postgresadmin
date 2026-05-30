import {
  DiaryEntry,
  diaryEntrySchema,
  diaryEntryTransferSchema
} from "@/shared/features/diary";
import { createProcrastinatedRepo } from "@/main/libs/firebase";
import z from "zod";

export const persistentDiaryCodec = z.codec(
  diaryEntrySchema,
  diaryEntryTransferSchema,
  {
    decode: (value) => diaryEntryTransferSchema.parse(value),
    encode: (value) => diaryEntrySchema.parse({ ...value, creationKey: undefined }),
  }
)

export const diaryRepo = createProcrastinatedRepo<DiaryEntry>(
  'diary',
  diaryEntrySchema
);
