import { DiaryEntrySerialisation, diaryEntrySerialisationSchema } from "@/shared/features/diary";
import { trpcReact } from "@/renderer/libs/react-query";
import { diaryInputStore } from "../stores";
import { serialisationDateNow } from "@/shared/schema";

export const useDiaryEntryCreator = () => {
  const { setText, text } = diaryInputStore();
  const {
    isError: isErrorCreatingDraft,
    isPending: isPendingCreatingDraft,
    isSuccess: isCreated,
    mutate,
  } = trpcReact.diary.create.useMutation({
    onSuccess: () => setText(''),
  });

  const create = (onSuccess: () => void) => {
    const entry: DiaryEntrySerialisation = diaryEntrySerialisationSchema.parse({
      created: serialisationDateNow(),
      data: { text }
    });
    mutate(entry, { onSuccess });
  };

  return {
    isErrorCreatingDraft,
    isPendingCreatingDraft,
    isCreated,
    text,
    create,
    setText,
  };
};
