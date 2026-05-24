import { DiaryEntryPersistent, diaryEntrySchema } from "@/shared/features/diary";
import { createProcrastinatedRepo } from "@/main/libs/firebase";

export const diaryRepo = createProcrastinatedRepo<DiaryEntryPersistent>(
  'diary',
  diaryEntrySchema
);
